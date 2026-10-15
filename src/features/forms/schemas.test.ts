import { describe, expect, it } from "vitest";
import { formASchema, formBSchema } from "./schemas";

const validA = {
  task: "Việc giả lập",
  company: "Doanh nghiệp giả lập",
  product: "Sản phẩm giả lập",
  channel: "Kênh giả lập",
  authority: "final",
  name: "Người giả lập",
  phone: "0000000000",
  consent: true,
};

const validB = {
  task: "Việc giả lập",
  participants: ["Team nội bộ"],
  company: "Doanh nghiệp giả lập",
  channel: "Mạng xã hội",
  authority: "shared",
  difficulties: [],
  tried: false,
  triedDetails: "",
  name: "Người giả lập",
  phone: "0000000000",
  consent: true,
};

describe("DEMO form schemas", () => {
  it("accepts Form A only when all required demo fields and consent are present", () => {
    expect(formASchema.safeParse(validA).success).toBe(true);
    expect(formASchema.safeParse({ ...validA, consent: false }).success).toBe(false);
    expect(formASchema.safeParse({ ...validA, task: "   " }).success).toBe(false);
  });

  it("requires at least one participant in Form B", () => {
    expect(formBSchema.safeParse(validB).success).toBe(true);
    expect(formBSchema.safeParse({ ...validB, participants: [] }).success).toBe(false);
  });

  it("limits optional Form B difficulties to two selections", () => {
    expect(formBSchema.safeParse({ ...validB, difficulties: ["A", "B"] }).success).toBe(true);
    expect(formBSchema.safeParse({ ...validB, difficulties: ["A", "B", "C"] }).success).toBe(false);
  });

  it("keeps the tried-details branch optional", () => {
    expect(formBSchema.safeParse({ ...validB, tried: true, triedDetails: "" }).success).toBe(true);
  });
});
