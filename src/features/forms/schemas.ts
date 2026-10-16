import { z } from "zod";

export const formASchema = z.object({
  task: z.string().trim().min(1, "Hãy chia sẻ ngắn về việc bạn muốn giải quyết."),
  company: z.string().trim().min(1, "Hãy nhập tên doanh nghiệp hoặc thương hiệu."),
  product: z.string().trim().min(1, "Hãy nhập sản phẩm hoặc dịch vụ."),
  channel: z.string().trim().min(1, "Hãy nhập kênh kinh doanh."),
  authority: z.string().min(1, "Hãy chọn vai trò của bạn trong quyết định."),
  name: z.string().trim().min(1, "Hãy nhập họ và tên."),
  phone: z.string().trim().min(1, "Hãy nhập số điện thoại hoặc Zalo."),
  consent: z.boolean().refine((value) => value, { message: "Hãy đồng ý để Ecom’s Diary liên hệ về yêu cầu này." }),
});

export const formBSchema = z.object({
  task: z.string().trim().min(1, "Hãy chia sẻ hiện trạng và mục tiêu bạn muốn đạt được."),
  participants: z.array(z.string()).min(1, "Hãy chọn ít nhất một người hoặc nhóm tham gia."),
  company: z.string().trim().min(1, "Hãy nhập tên doanh nghiệp hoặc thương hiệu."),
  channel: z.string().min(1, "Hãy chọn kênh kinh doanh."),
  authority: z.string().min(1, "Hãy chọn vai trò của bạn trong quyết định."),
  difficulties: z.array(z.string()).max(2, "Chọn tối đa hai nội dung."),
  tried: z.boolean(),
  triedDetails: z.string(),
  name: z.string().trim().min(1, "Hãy nhập họ và tên."),
  phone: z.string().trim().min(1, "Hãy nhập số điện thoại hoặc Zalo."),
  consent: z.boolean().refine((value) => value, { message: "Hãy đồng ý để Ecom’s Diary liên hệ về yêu cầu này." }),
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
