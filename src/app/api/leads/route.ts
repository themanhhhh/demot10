import { randomUUID } from "node:crypto";
import { formASchema, formBSchema } from "@/features/forms/schemas";

const maxBodyBytes = 24_000;

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

async function readBody(request: Request) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBodyBytes) {
      await reader.cancel();
      throw new RangeError("body-too-large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return jsonError("Yêu cầu không hợp lệ. Vui lòng tải lại trang và thử lại.", 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxBodyBytes) {
    return jsonError("Nội dung gửi lên quá lớn.", 413);
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return jsonError("Hệ thống tiếp nhận chưa sẵn sàng. Vui lòng thử lại sau.", 503);
  }

  let destination: URL;
  try {
    destination = new URL(webhookUrl);
  } catch {
    return jsonError("Hệ thống tiếp nhận chưa sẵn sàng. Vui lòng thử lại sau.", 503);
  }
  if (destination.protocol !== "https:" && process.env.NODE_ENV === "production") {
    return jsonError("Hệ thống tiếp nhận chưa sẵn sàng. Vui lòng thử lại sau.", 503);
  }

  let body: unknown;
  try {
    body = JSON.parse(await readBody(request));
  } catch (error) {
    if (error instanceof RangeError) return jsonError("Nội dung gửi lên quá lớn.", 413);
    return jsonError("Dữ liệu gửi lên không hợp lệ.", 400);
  }

  if (!body || typeof body !== "object") {
    return jsonError("Dữ liệu gửi lên không hợp lệ.", 400);
  }

  const payload = body as Record<string, unknown>;
  const form = payload.form;
  const parsed = payload.formType === "a"
    ? formASchema.safeParse(form)
    : payload.formType === "b"
      ? formBSchema.safeParse(form)
      : null;

  if (!parsed) {
    return jsonError("Loại biểu mẫu không hợp lệ.", 400);
  }
  if (!parsed.success) {
    return jsonError("Một số thông tin chưa hợp lệ. Vui lòng kiểm tra lại biểu mẫu.", 422);
  }

  const submissionId = typeof payload.submissionId === "string" && /^[\w-]{8,80}$/.test(payload.submissionId)
    ? payload.submissionId
    : randomUUID();

  try {
    const response = await fetch(destination, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": submissionId,
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        id: submissionId,
        formType: payload.formType,
        submittedAt: new Date().toISOString(),
        data: parsed.data,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!response.ok) {
      return jsonError("Chưa gửi được thông tin. Vui lòng thử lại sau.", 502);
    }
  } catch {
    return jsonError("Chưa gửi được thông tin. Vui lòng kiểm tra kết nối và thử lại.", 502);
  }

  return Response.json({ id: submissionId, received: true }, { status: 202 });
}
