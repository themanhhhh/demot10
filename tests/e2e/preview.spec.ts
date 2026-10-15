import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function waitForGsapTransitions(page: Page) {
  await expect.poll(() => page.locator(".pain-response, .direction-button, .configuration-option, .deal-preview").evaluateAll((elements) =>
    elements.every((element) => {
      const style = (element as HTMLElement).style;
      return style.opacity === "" && style.visibility === "";
    }),
  )).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("serves the private preview with forms hidden and public metadata", async ({ page }) => {
  await expect(page).toHaveTitle("Giải pháp của Ecom’s Diary");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator(".preview-bar")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nhiều cách ghép team");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("form.lead-form")).toHaveCount(0);
});

test("loads the local horse reference and labels it as a candidate asset", async ({ page }) => {
  const image = page.locator(".chess-reference-image");
  await expect(image).toHaveAttribute("alt", /ảnh tham chiếu trích từ PDF, chưa phải asset cuối/i);
  await expect(page.locator(".scene-label")).toContainText("CHỜ ASSET GỐC");
  await expect.poll(() => image.evaluate((element) => {
    const imageElement = element as HTMLImageElement;
    return imageElement.complete && imageElement.naturalWidth > 0;
  })).toBe(true);
  const imageSrc = await image.getAttribute("src");
  expect(decodeURIComponent(imageSrc ?? "")).toContain("/assets/chess/horse-reference-pdf-preview.webp");
});

test("scenario and solution changes reset dependent Team Builder state", async ({ page }) => {
  await page.locator('[data-pain="team"]').click();
  await expect(page.locator(".deal-preview").getByText("Team hiện tại đang quá tải", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Bổ sung năng lực còn thiếu/ }).click();
  await page.locator('[data-configuration="team-capacity-freelancer"]').click();
  await expect(page.getByText("Chưa chọn cấu hình", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: /Làm rõ cách phối hợp công việc/ }).click();
  await expect(page.getByText("Chưa chọn cấu hình", { exact: true })).toBeVisible();
  await expect(page.locator('[data-configuration="team-capacity-freelancer"]')).toHaveCount(0);

  await page.getByRole("button", { name: "Doanh số tăng chậm dù đã chạy quảng cáo", exact: true }).click();
  await expect(page.getByText("Chưa chọn hướng giải", { exact: true })).toBeVisible();
  await expect(page.getByText("Chưa chọn cấu hình", { exact: true })).toBeVisible();
});

test("Form A keeps its draft on Back, validates locally and only confirms a DEMO", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") posts.push(`${request.method()} ${request.url()}`);
  });

  await page.getByRole("button", { name: "Mở việc" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Chọn trao đổi trước" })).toBeFocused();
  await dialog.getByRole("button", { name: "Chọn trao đổi trước" }).click();

  const form = page.locator("form.lead-form").first();
  const task = form.getByLabel("Bạn muốn giải quyết việc gì trong doanh nghiệp?");
  await task.fill("Bối cảnh demo, không phải dữ liệu thật");
  await page.getByRole("button", { name: /Quay lại chọn cách bắt đầu/ }).click();
  await page.getByRole("button", { name: "Chọn trao đổi trước" }).click();
  await expect(task).toHaveValue("Bối cảnh demo, không phải dữ liệu thật");

  await form.getByLabel("Tên doanh nghiệp / thương hiệu").fill("Doanh nghiệp demo");
  await form.getByLabel("Sản phẩm hoặc dịch vụ").fill("Sản phẩm demo");
  await form.getByLabel("Sản phẩm đang được bán qua kênh nào?").fill("Kênh demo");
  await form.getByRole("radio", { name: "Tôi là người quyết định cuối cùng" }).click();
  await form.getByLabel("Họ và tên").fill("Người dùng demo");
  await form.getByLabel("Điện thoại / Zalo").fill("0000000000");
  await form.getByRole("checkbox", { name: /Tôi xác nhận đây là dữ liệu giả lập/ }).click();
  await form.getByRole("button", { name: "Xem xác nhận DEMO" }).click();

  await expect(form.getByText("Đây là mô phỏng · CHƯA GỬI THẬT")).toBeVisible();
  expect(posts).toEqual([]);
});

test("Form B validates both steps, enforces the two-choice limit and retains its draft", async ({ page }) => {
  await page.getByRole("button", { name: "Mở việc" }).first().click();
  await page.getByRole("button", { name: "Chọn gửi bối cảnh" }).click();
  const form = page.locator("form.lead-form").nth(1);
  await form.getByRole("button", { name: "Tiếp tục" }).click();
  await expect(form.getByText("Hãy mô tả việc bạn muốn bắt đầu.")).toBeVisible();

  await form.getByLabel("Bạn muốn giải quyết việc gì?").fill("Bối cảnh demo");
  await form.getByRole("checkbox", { name: "Team nội bộ" }).click();
  await form.getByLabel("Tên doanh nghiệp / thương hiệu").fill("Doanh nghiệp demo");
  const channel = form.getByLabel("Kênh đang hoạt động");
  await channel.selectOption({ label: "Mạng xã hội" });
  await expect(channel).toHaveValue("social");
  await form.getByRole("button", { name: "Tiếp tục" }).click();
  await expect(form.getByText("Bước 2 / 2 · Không gửi thật")).toBeVisible();

  await form.getByRole("checkbox", { name: "Chưa rõ hướng ưu tiên" }).click();
  await form.getByRole("checkbox", { name: "Thiếu năng lực chuyên môn" }).click();
  await expect(form.getByRole("checkbox", { name: "Nguồn lực đang phân tán" })).toBeDisabled();
  await form.getByRole("checkbox", { name: "Đã thử một cách xử lý" }).click();
  await expect(form.getByLabel("Bạn đã thử cách nào?")).toBeVisible();
  await form.getByLabel("Bạn đã thử cách nào?").fill("Đã thử trong dữ liệu demo");
  await form.getByRole("radio", { name: "Tôi cùng tham gia quyết định" }).click();
  await form.getByLabel("Họ và tên").fill("Người dùng demo");
  await form.getByLabel("Điện thoại / Zalo").fill("0000000000");
  await form.getByRole("checkbox", { name: /Tôi xác nhận đây là dữ liệu giả lập/ }).click();

  await form.getByRole("button", { name: "Quay lại bước 1" }).click();
  await expect(form.getByLabel("Bạn muốn giải quyết việc gì?")).toHaveValue("Bối cảnh demo");
  await form.getByRole("button", { name: "Tiếp tục" }).click();
  await form.getByRole("button", { name: "Xem xác nhận DEMO" }).click();
  await expect(form.getByText("Đây là mô phỏng · CHƯA GỬI THẬT")).toBeVisible();
});

test("closing the dialog resets the form draft and restores focus to its trigger", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Mở việc" }).first();
  await trigger.click();
  await page.getByRole("button", { name: "Chọn trao đổi trước" }).click();
  const form = page.locator("form.lead-form").first();
  await form.getByLabel("Bạn muốn giải quyết việc gì trong doanh nghiệp?").fill("Dữ liệu chỉ tồn tại trong phiên demo");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.getByRole("button", { name: "Chọn trao đổi trước" }).click();
  await expect(page.locator("form.lead-form").first().getByLabel("Bạn muốn giải quyết việc gì trong doanh nghiệp?")).toHaveValue("");
});

test("core preview interactions produce no runtime errors or external submissions", async ({ page }) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const externalRequests: string[] = [];
  const nonGetRequests: string[] = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("request", (request) => {
    const url = new URL(request.url());
    if ((url.protocol === "http:" || url.protocol === "https:") && url.origin !== "http://127.0.0.1:3104") {
      externalRequests.push(url.href);
    }
    if (request.method() !== "GET") nonGetRequests.push(`${request.method()} ${url.pathname}`);
  });

  await page.reload();
  await page.locator('[data-pain="product"]').click();
  await page.getByRole("button", { name: "Mở việc" }).first().click();
  await page.getByRole("button", { name: "Chọn gửi bối cảnh" }).click();
  await page.keyboard.press("Escape");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
  expect(nonGetRequests).toEqual([]);
});

test("has no axe violations in the landing and Form A/B flows", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".hero-art")).toHaveCSS("opacity", "1");
  await waitForGsapTransitions(page);

  const homeAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(homeAudit.violations).toEqual([]);

  await page.getByRole("button", { name: "Mở việc" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  await expect.poll(() => page.locator(".dialog-overlay").evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  await waitForGsapTransitions(page);
  const dialogAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(dialogAudit.violations).toEqual([]);

  await page.getByRole("button", { name: "Chọn trao đổi trước" }).click();
  const formAAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(formAAudit.violations).toEqual([]);

  await page.getByRole("button", { name: /Quay lại chọn cách bắt đầu/ }).click();
  await page.getByRole("button", { name: "Chọn gửi bối cảnh" }).click();
  const formBAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(formBAudit.violations).toEqual([]);
});

test("does not overflow at the target viewport widths", async ({ page }) => {
  for (const width of [320, 390, 430, 1365]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
  }
});
