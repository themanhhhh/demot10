import type { FormAValues, FormBValues } from "@/features/forms/schemas";

type FormType = "a" | "b";
type LeadValues = FormAValues | FormBValues;

export async function submitLead(formType: FormType, form: LeadValues, submissionId: string) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ formType, form, submissionId }),
  });

  const result = await response.json().catch(() => null) as { error?: string; received?: boolean } | null;
  if (!response.ok || !result?.received) {
    throw new Error(result?.error ?? "Chưa gửi được thông tin. Vui lòng thử lại sau.");
  }
}
