import { useContext, useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode, RefObject } from "react";
import { Controller, useForm } from "react-hook-form";
import type { FieldError as HookFormFieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { defaultFormAValues, defaultFormBValues, formASchema, formBSchema } from "@/features/forms/schemas";
import type { FormAValues, FormBValues } from "@/features/forms/schemas";
import { DialogFocusContext } from "@/contexts/dialog-focus-context";

type ErrorLike = HookFormFieldError | undefined;

const authorityOptions = [
  ["final", "Tôi là người quyết định cuối cùng"],
  ["shared", "Tôi cùng tham gia quyết định"],
  ["support", "Tôi đang tìm hiểu / hỗ trợ người quyết định"],
];

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function FieldError({ error, id }: { error?: { message?: string }; id: string }) {
  return error ? <p className="field-error" id={id} role="alert">{error.message}</p> : null;
}

function CheckboxChoice({
  id,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className = "check-row",
  errorId,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  errorId?: string;
}) {
  return (
    <label className={className}>
      <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onCheckedChange(event.currentTarget.checked)} aria-invalid={Boolean(errorId)} aria-describedby={errorId} />
      <span>{label}</span>
    </label>
  );
}

function DecisionField({
  value,
  onChange,
  error,
  idPrefix,
  focusRef,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: ErrorLike;
  idPrefix: string;
  focusRef?: (element: HTMLButtonElement | null) => void;
}) {
  return (
    <>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        aria-label="Quyền quyết định"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${idPrefix}-error` : undefined}
      >
        {authorityOptions.map(([optionValue, label]) => (
          <RadioGroupItem
            key={optionValue}
            id={`${idPrefix}-${optionValue}`}
            value={optionValue}
            aria-label={label}
            ref={optionValue === "final" ? focusRef : undefined}
          >
            {label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      <FieldError error={error} id={`${idPrefix}-error`} />
    </>
  );
}

const previewDataNotice = "Biểu mẫu chưa kết nối hệ thống tiếp nhận. Thông tin bạn nhập chỉ tồn tại trong phiên xem trước này, không được gửi đi hoặc lưu thành hồ sơ.";

function ConsentField({
  label,
  checked,
  onChange,
  error,
  id,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: ErrorLike;
  id: string;
}) {
  return (
    <>
      <CheckboxChoice
        id={id}
        className="consent-row"
        label={label}
        checked={checked}
        onCheckedChange={onChange}
        errorId={error ? `${id}-error` : undefined}
      />
      <FieldError error={error} id={`${id}-error`} />
    </>
  );
}

function DemoResult() {
  return (
    <div className="form-result" role="status">
      <span className="result-icon" aria-hidden="true"><Check size={13} /></span>
      <div><strong>Đã hoàn tất bước xem trước</strong><p>Thông tin bạn nhập không được gửi đi hoặc lưu thành hồ sơ.</p></div>
    </div>
  );
}

function FormA({ active }: { active: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const firstTaskRef = useRef<HTMLTextAreaElement>(null);
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormAValues>({
    resolver: zodResolver(formASchema),
    defaultValues: defaultFormAValues,
    mode: "onTouched",
  });
  const taskField = register("task");

  useEffect(() => {
    if (active) firstTaskRef.current?.focus();
  }, [active]);

  return (
    <form className="lead-form" hidden={!active} noValidate onSubmit={handleSubmit(() => setSubmitted(true))}>
      <fieldset className="form-group">
        <legend><span>01</span> Việc bạn muốn bắt đầu <i>* Bắt buộc</i></legend>
        <label className="field-label" htmlFor="a-task">Bạn muốn giải quyết việc gì trong doanh nghiệp?</label>
        <textarea id="a-task" {...taskField} ref={(element) => { taskField.ref(element ?? undefined); firstTaskRef.current = element; }} rows={3} placeholder="Ví dụ giả lập: Tôi muốn xem lại cách khách hàng tìm đến sản phẩm..." aria-invalid={Boolean(errors.task)} />
        <FieldError error={errors.task} id="a-task-error" />
      </fieldset>
      <fieldset className="form-group">
        <legend><span>02</span> Doanh nghiệp, sản phẩm và kênh <i>* Bắt buộc</i></legend>
        <label className="field-label" htmlFor="a-company">Tên doanh nghiệp / thương hiệu</label><input id="a-company" autoComplete="off" placeholder="Dữ liệu giả lập" aria-invalid={Boolean(errors.company)} {...register("company")} /><FieldError error={errors.company} id="a-company-error" />
        <label className="field-label" htmlFor="a-product">Sản phẩm hoặc dịch vụ</label><input id="a-product" autoComplete="off" placeholder="Dữ liệu giả lập" aria-invalid={Boolean(errors.product)} {...register("product")} /><FieldError error={errors.product} id="a-product-error" />
        <label className="field-label" htmlFor="a-channel">Sản phẩm đang được bán qua kênh nào?</label><input id="a-channel" autoComplete="off" placeholder="Dữ liệu giả lập" aria-invalid={Boolean(errors.channel)} {...register("channel")} /><FieldError error={errors.channel} id="a-channel-error" />
      </fieldset>
      <fieldset className="form-group">
        <legend id="a-authority-legend"><span>03</span> Quyền quyết định <i>* Bắt buộc</i></legend>
        <p className="field-hint">Vai trò của bạn trong quyết định về việc này là gì?</p>
        <Controller name="authority" control={control} render={({ field }) => (
          <DecisionField value={field.value} onChange={field.onChange} error={errors.authority} idPrefix="a-authority" focusRef={(element) => field.ref(element ?? undefined)} />
        )} />
      </fieldset>
      <fieldset className="form-group">
        <legend><span>04</span> Cách liên hệ <i>* Bắt buộc</i></legend>
        <label className="field-label" htmlFor="a-name">Họ và tên</label><input id="a-name" autoComplete="off" placeholder="Tên giả lập" aria-invalid={Boolean(errors.name)} {...register("name")} /><FieldError error={errors.name} id="a-name-error" />
        <label className="field-label" htmlFor="a-phone">Điện thoại / Zalo</label><input id="a-phone" type="tel" autoComplete="off" placeholder="Số giả lập" aria-invalid={Boolean(errors.phone)} {...register("phone")} /><FieldError error={errors.phone} id="a-phone-error" />
      </fieldset>
      <fieldset className="form-group consent-group">
        <legend><span>05</span> Thông tin xử lý <i>* Xác nhận đã đọc</i></legend>
        <p className="field-hint">{previewDataNotice}</p>
        <Controller name="consent" control={control} render={({ field }) => (
          <ConsentField label="Tôi xác nhận đã đọc thông tin này." checked={field.value} onChange={field.onChange} error={errors.consent} id="a-consent" />
        )} />
      </fieldset>
      <div className="form-actions"><Button type="submit">Hoàn tất xem trước <ArrowUpRight aria-hidden="true" size={13} /></Button><span>Không gửi dữ liệu · Không lưu hồ sơ</span></div>
      {submitted && <DemoResult />}
    </form>
  );
}

function FormB({ active }: { active: boolean }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const firstTaskRef = useRef<HTMLTextAreaElement>(null);
  const firstAuthorityRef = useRef<HTMLButtonElement>(null);
  const { register, control, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<FormBValues>({
    resolver: zodResolver(formBSchema),
    defaultValues: defaultFormBValues,
    mode: "onTouched",
  });
  const participants = watch("participants");
  const difficulties = watch("difficulties");
  const tried = watch("tried");
  const taskField = register("task");

  useEffect(() => {
    if (!active) return;
    if (step === 1) firstTaskRef.current?.focus();
    else firstAuthorityRef.current?.focus();
  }, [active, step]);

  async function continueToStepTwo() {
    const valid = await trigger(["task", "participants", "company", "channel"], { shouldFocus: true });
    if (valid) setStep(2);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 2) handleSubmit(() => setSubmitted(true))(event);
  }

  function toggleChoice(name: "participants" | "difficulties", current: string[], value: string, checked: boolean) {
    const next = checked ? [...current, value] : current.filter((item) => item !== value);
    const options = { shouldDirty: true, shouldTouch: true, shouldValidate: true } as const;
    if (name === "participants") setValue("participants", next, options);
    else setValue("difficulties", next, options);
  }

  return (
    <form className="lead-form" hidden={!active} noValidate onSubmit={handleFormSubmit}>
      <div className="form-progress" aria-label="Tiến độ biểu mẫu">
        <span className={`progress-step${step === 1 ? " is-current" : ""}`} aria-current={step === 1 ? "step" : undefined}><b>01</b> Việc & bối cảnh</span>
        <span className="progress-line" />
        <span className={`progress-step${step === 2 ? " is-current" : ""}`} aria-current={step === 2 ? "step" : undefined}><b>02</b> Quyết định & liên hệ</span>
      </div>

      <div className="form-step" hidden={step !== 1}>
        <fieldset className="form-group">
          <legend><span>01</span> Việc bạn muốn bắt đầu <i>* Bắt buộc</i></legend>
          <label className="field-label" htmlFor="b-task">Bạn muốn giải quyết việc gì?</label><textarea id="b-task" {...taskField} ref={(element) => { taskField.ref(element ?? undefined); firstTaskRef.current = element; }} rows={3} placeholder="Dữ liệu giả lập, không ghi thông tin nhạy cảm" aria-invalid={Boolean(errors.task)} /><FieldError error={errors.task} id="b-task-error" />
        </fieldset>
        <fieldset className="form-group participant-group">
          <legend><span>02</span> Ai đang tham gia? <i>* Chọn ít nhất một</i></legend>
          <p className="field-hint">Có thể chọn nhiều đáp án.</p>
          <Controller name="participants" control={control} render={({ field }) => (
            <div>
              {["Client / chủ doanh nghiệp", "Team nội bộ", "Agency", "Freelancer / chuyên gia"].map((value, index) => (
                <CheckboxChoice key={value} id={`participant-${index}`} label={value} checked={field.value.includes(value)} onCheckedChange={(checked) => toggleChoice("participants", field.value, value, checked === true)} errorId={errors.participants ? "participants-error" : undefined} />
              ))}
            </div>
          )} />
          <FieldError error={errors.participants} id="participants-error" />
        </fieldset>
        <fieldset className="form-group">
          <legend><span>03</span> Doanh nghiệp / thương hiệu <i>* Bắt buộc</i></legend>
          <label className="field-label" htmlFor="b-company">Tên doanh nghiệp / thương hiệu</label><input id="b-company" autoComplete="off" placeholder="Dữ liệu giả lập" aria-invalid={Boolean(errors.company)} {...register("company")} /><FieldError error={errors.company} id="b-company-error" />
        </fieldset>
        <fieldset className="form-group">
          <legend><span>04</span> Kênh kinh doanh <i>* Bắt buộc</i></legend>
          <label className="field-label" htmlFor="b-channel">Kênh đang hoạt động</label>
          <Controller name="channel" control={control} render={({ field }) => (
            <select
              id="b-channel"
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={(event) => {
                const channel = event.currentTarget.value;
                field.onChange(channel);
                setValue("channel", channel, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
              }}
              onBlur={field.onBlur}
              aria-invalid={Boolean(errors.channel)}
            >
              <option value="">Chọn một phương án</option>
              <option value="website">Website / thương mại điện tử</option>
              <option value="social">Mạng xã hội</option>
              <option value="marketplace">Sàn thương mại điện tử</option>
              <option value="direct">Cửa hàng / bán trực tiếp</option>
              <option value="multiple">Nhiều kênh</option>
              <option value="other">Khác</option>
            </select>
          )} />
          <FieldError error={errors.channel} id="b-channel-error" />
        </fieldset>
        <div className="form-actions"><Button type="button" onClick={continueToStepTwo}>Tiếp tục <ArrowRight aria-hidden="true" size={13} /></Button><span>Bước 1 / 2 · Dữ liệu giả lập</span></div>
      </div>

      <div className="form-step" hidden={step !== 2}>
        <fieldset className="form-group">
          <legend><span>05</span> Quyền quyết định <i>* Bắt buộc</i></legend>
          <p className="field-hint">Vai trò của bạn trong quyết định về việc này là gì?</p>
          <Controller name="authority" control={control} render={({ field }) => (
            <DecisionField
              value={field.value}
              onChange={field.onChange}
              error={errors.authority}
              idPrefix="b-authority"
              focusRef={(element) => {
                field.ref(element ?? undefined);
                firstAuthorityRef.current = element;
              }}
            />
          )} />
        </fieldset>
        <fieldset className="form-group">
          <legend><span>06</span> Phần đang khó xử lý <i>Tùy chọn · tối đa 2</i></legend>
          <p className="field-hint">Chọn tối đa hai nội dung, nếu phù hợp.</p>
          <Controller name="difficulties" control={control} render={({ field }) => (
            <div className="difficulty-grid">
              {["Chưa rõ hướng ưu tiên", "Thiếu năng lực chuyên môn", "Nguồn lực đang phân tán", "Khó thống nhất phạm vi"].map((value, index) => {
                const checked = field.value.includes(value);
                return <CheckboxChoice key={value} id={`difficulty-${index}`} label={value} checked={checked} disabled={field.value.length >= 2 && !checked} onCheckedChange={(nextChecked) => toggleChoice("difficulties", field.value, value, nextChecked === true)} />;
              })}
            </div>
          )} />
          <p className="field-hint" aria-live="polite">Đã chọn {difficulties.length} / 2.{difficulties.length === 2 ? " Có thể bỏ một lựa chọn để đổi." : ""}</p>
          <FieldError error={errors.difficulties} id="difficulties-error" />
        </fieldset>
        <fieldset className="form-group">
          <legend><span>07</span> Đã thử cách nào chưa? <i>Tùy chọn</i></legend>
          <Controller name="tried" control={control} render={({ field }) => (
            <CheckboxChoice id="b-tried-toggle" label="Đã thử một cách xử lý" checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
          )} />
          {tried && <div className="conditional-field"><label className="field-label" htmlFor="b-tried">Bạn đã thử cách nào?</label><textarea id="b-tried" rows={2} placeholder="Không bắt buộc · Chỉ nhập dữ liệu giả lập" {...register("triedDetails")} /></div>}
        </fieldset>
        <fieldset className="form-group">
          <legend><span>08</span> Cách liên hệ <i>* Bắt buộc</i></legend>
          <label className="field-label" htmlFor="b-name">Họ và tên</label><input id="b-name" autoComplete="off" placeholder="Tên giả lập" aria-invalid={Boolean(errors.name)} {...register("name")} /><FieldError error={errors.name} id="b-name-error" />
          <label className="field-label" htmlFor="b-phone">Điện thoại / Zalo</label><input id="b-phone" type="tel" autoComplete="off" placeholder="Số giả lập" aria-invalid={Boolean(errors.phone)} {...register("phone")} /><FieldError error={errors.phone} id="b-phone-error" />
          <p className="field-hint">{previewDataNotice}</p>
          <Controller name="consent" control={control} render={({ field }) => (
            <ConsentField label="Tôi xác nhận đã đọc thông tin này." checked={field.value} onChange={field.onChange} error={errors.consent} id="b-consent" />
          )} />
        </fieldset>
        <div className="form-actions"><Button type="submit">Hoàn tất xem trước <ArrowUpRight aria-hidden="true" size={13} /></Button><span>Bước 2 / 2 · Không gửi dữ liệu</span></div>
        <button className="back-link step-back" type="button" onClick={() => setStep(1)}><ArrowLeft aria-hidden="true" size={12} /> Quay lại bước 1</button>
      </div>
      {submitted && <DemoResult />}
    </form>
  );
}

function RoutePicker({
  onSelect,
  routePickerRef,
}: {
  onSelect: (route: "a" | "b") => void;
  routePickerRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={routePickerRef}>
      <Eyebrow><span className="eyebrow-line" /> MỞ VIỆC · CHỌN CÁCH BẮT ĐẦU</Eyebrow>
      <Dialog.Title asChild><h2 className="dialog-title">Bạn muốn bắt đầu<br /><em>thế nào?</em></h2></Dialog.Title>
      <Dialog.Description asChild><p className="dialog-intro">Chưa cần biết chính xác nguyên nhân hoặc thứ tự. Chọn cách chia sẻ phù hợp để xem xét khả năng tiếp nhận.</p></Dialog.Description>
      <div className="route-grid">
        <article className="route-card">
          <div className="route-card-top"><span>FORM A</span><span className="route-duration">TRAO ĐỔI TRƯỚC</span></div>
          <h3>Trao đổi trước</h3><p>Giới thiệu ngắn về doanh nghiệp và việc muốn giải quyết. Một trang, bắt đầu gọn.</p>
          <Button className="route-button" type="button" data-default-route onClick={() => onSelect("a")}>Chọn trao đổi trước <ArrowUpRight aria-hidden="true" size={12} /></Button>
        </article>
        <article className="route-card route-card-deep">
          <div className="route-card-top"><span>FORM B</span><span className="route-duration">GỬI BỐI CẢNH</span></div>
          <h3>Gửi bối cảnh trước</h3><p>Chia sẻ kỹ hơn về việc, những người đang tham gia và phần khó xử lý. Hai bước ngắn.</p>
          <Button className="route-button" variant="outline" type="button" onClick={() => onSelect("b")}>Chọn gửi bối cảnh <ArrowUpRight aria-hidden="true" size={12} /></Button>
        </article>
      </div>
      <p className="dialog-footnote"><span aria-hidden="true">ⓘ</span> Dữ liệu chỉ dùng giả lập. Không nhập thông tin cá nhân thật; nội dung không được gửi đi hoặc lưu lại.</p>
    </div>
  );
}

export function StartDialogContent() {
  const [route, setRoute] = useState<"a" | "b" | null>(null);
  const routePickerRef = useRef<HTMLDivElement>(null);
  const { restoreTrigger } = useContext(DialogFocusContext);

  useEffect(() => {
    if (route === null) routePickerRef.current?.querySelector<HTMLButtonElement>("[data-default-route]")?.focus();
  }, [route]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay" />
      <Dialog.Content
        className="work-dialog"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          routePickerRef.current?.querySelector<HTMLButtonElement>("[data-default-route]")?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          restoreTrigger();
        }}
      >
        <div className="dialog-shell">
          <div className="dialog-topbar">
            <Dialog.Close asChild><a className="wordmark dialog-wordmark" href="#top"><span className="wordmark-mark" aria-hidden="true">E</span><span>Giải pháp của Ecom’s Diary</span></a></Dialog.Close>
            <Dialog.Close asChild><button className="icon-button" type="button" aria-label="Đóng cửa sổ"><X aria-hidden="true" size={18} /></button></Dialog.Close>
          </div>
          <div className="dialog-content">
            {route === null && <RoutePicker onSelect={setRoute} routePickerRef={routePickerRef} />}
            {route !== null && (
              <div>
                <button className="back-link" type="button" onClick={() => setRoute(null)}><ArrowLeft aria-hidden="true" size={12} /> Quay lại chọn cách bắt đầu</button>
                <div className="form-heading">
                  <div>
                    <p className="eyebrow">{route === "a" ? "FORM A · TRAO ĐỔI TRƯỚC" : "FORM B · GỬI BỐI CẢNH"}</p>
                    <Dialog.Title asChild><h2 className="form-title">{route === "a" ? <>Cho chúng tôi biết<br /><em>việc bạn muốn bắt đầu.</em></> : <>Giúp chúng tôi hiểu<br /><em>bối cảnh của bạn.</em></>}</h2></Dialog.Title>
                  </div>
                  <span className="preview-stamp form-stamp">XEM TRƯỚC<br />CHƯA GỬI THẬT</span>
                </div>
                <Dialog.Description asChild><p className="form-warning"><strong>Preview nội bộ.</strong> Chỉ dùng dữ liệu giả lập. Form này không gửi thông tin và không lưu hồ sơ. Trường và lựa chọn cần được đối chiếu với Form gốc trước khi duyệt.</p></Dialog.Description>
              </div>
            )}
            <FormA active={route === "a"} />
            <FormB active={route === "b"} />
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
