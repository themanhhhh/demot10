import { z } from "zod";

export const formASchema = z.object({
  task: z.string().trim().min(1, "Hãy mô tả việc bạn muốn bắt đầu."),
  company: z.string().trim().min(1, "Hãy nhập tên doanh nghiệp hoặc thương hiệu giả lập."),
  product: z.string().trim().min(1, "Hãy nhập sản phẩm hoặc dịch vụ giả lập."),
  channel: z.string().trim().min(1, "Hãy nhập kênh kinh doanh giả lập."),
  authority: z.string().min(1, "Hãy chọn vai trò quyết định."),
  name: z.string().trim().min(1, "Hãy nhập tên giả lập."),
  phone: z.string().trim().min(1, "Hãy nhập số điện thoại giả lập."),
  consent: z.boolean().refine((value) => value, { message: "Cần xác nhận đây là dữ liệu giả lập." }),
});

export const formBSchema = z.object({
  task: z.string().trim().min(1, "Hãy mô tả việc bạn muốn bắt đầu."),
  participants: z.array(z.string()).min(1, "Chọn ít nhất một nhóm đang tham gia."),
  company: z.string().trim().min(1, "Hãy nhập tên doanh nghiệp hoặc thương hiệu giả lập."),
  channel: z.string().min(1, "Hãy chọn kênh kinh doanh."),
  authority: z.string().min(1, "Hãy chọn vai trò quyết định."),
  difficulties: z.array(z.string()).max(2, "Chọn tối đa hai nội dung."),
  tried: z.boolean(),
  triedDetails: z.string(),
  name: z.string().trim().min(1, "Hãy nhập tên giả lập."),
  phone: z.string().trim().min(1, "Hãy nhập số điện thoại giả lập."),
  consent: z.boolean().refine((value) => value, { message: "Cần xác nhận đây là dữ liệu giả lập." }),
});

export type FormAValues = z.infer<typeof formASchema>;
export type FormBValues = z.infer<typeof formBSchema>;

export const defaultFormAValues: FormAValues = {
  task: "",
  company: "",
  product: "",
  channel: "",
  authority: "",
  name: "",
  phone: "",
  consent: false,
};

export const defaultFormBValues: FormBValues = {
  task: "",
  participants: [],
  company: "",
  channel: "",
  authority: "",
  difficulties: [],
  tried: false,
  triedDetails: "",
  name: "",
  phone: "",
  consent: false,
};
