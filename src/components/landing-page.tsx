"use client";

import { lazy, Suspense, useContext, useReducer, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleHelp,
  MoveRight,
  Sparkles,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { demoScenarios, resourceLabels } from "@/features/deal-demo/scenarios";
import { demoReducer, initialDemoState } from "@/features/deal-demo/reducer";
import type { DemoAction, DemoState } from "@/features/deal-demo/model";
import { DialogFocusContext } from "@/contexts/dialog-focus-context";

const StartDialogContent = lazy(() => import("@/components/start-dialog").then((module) => ({ default: module.StartDialogContent })));

const resources = [
  { id: "inhouse", name: "In-house", type: "NỘI LỰC", detail: "Người hiểu sản phẩm, khách hàng và nhịp vận hành bên trong doanh nghiệp.", tag: "Nền tảng bạn đang có", symbol: "◒" },
  { id: "agency", name: "Agency", type: "ĐỘI NGŨ CHUYÊN MÔN", detail: "Một nhóm có thể cùng triển khai các đầu việc liên kết trong phạm vi đã thống nhất.", tag: "Bổ sung năng lực triển khai", symbol: "▤" },
  { id: "freelancer", name: "Freelancer", type: "CHUYÊN GIA ĐỘC LẬP", detail: "Một chuyên môn cụ thể, có thể tham gia theo phạm vi và thời điểm phù hợp.", tag: "Bổ sung một năng lực cụ thể", symbol: "✳" },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function DemoStamp({ children = <>DEMO<br />GIẢ ĐỊNH</> }: { children?: ReactNode }) {
  return <span className="demo-stamp">{children}</span>;
}

function WorkTrigger({
  children,
  variant = "primary",
  size = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "dark";
  size?: "default" | "small";
  className?: string;
}) {
  const { registerTrigger } = useContext(DialogFocusContext);

  return (
    <Dialog.Trigger asChild>
      <Button type="button" variant={variant} size={size} className={className} onClick={(event) => registerTrigger(event.currentTarget)}>
        {children}
      </Button>
    </Dialog.Trigger>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Giải pháp của Ecom’s Diary, về đầu trang">
        <span className="wordmark-mark" aria-hidden="true">E</span>
        <span>Giải pháp của<br className="wordmark-break" /> Ecom’s Diary</span>
      </a>
      <nav className="main-nav" aria-label="Điều hướng chính">
        <a href="#why">Vì sao</a>
        <a href="#flow">Cách ghép team</a>
        <a href="#start">Bắt đầu</a>
      </nav>
      <WorkTrigger variant="dark" size="small">Mở việc <ArrowUpRight aria-hidden="true" size={13} /></WorkTrigger>
    </header>
  );
}

function Hero() {
  const heroArtRef = useScrollReveal<HTMLElement>();

  return (
    <section className="hero section-wrap" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <Eyebrow><span className="eyebrow-line" />Bắt đầu từ một việc kinh doanh</Eyebrow>
        <h1 id="hero-title">Một việc kinh doanh.<br /><em>Nhiều cách ghép team.</em></h1>
        <p className="hero-intro">Xem xét những hướng giải khác nhau do Partner chuyên môn đề xuất. Kết hợp đội ngũ bạn đang có với nguồn lực phù hợp để làm rõ phạm vi, vai trò và cam kết.</p>
        <div className="hero-actions">
          <WorkTrigger>Mở việc <ArrowUpRight aria-hidden="true" size={14} /></WorkTrigger>
          <Button asChild variant="outline"><a href="#flow">Xem cách ghép team <ArrowDown aria-hidden="true" size={13} /></a></Button>
        </div>
        <p className="hero-note"><Sparkles aria-hidden="true" size={13} /> Partner đề xuất. Bạn quyết định cuối cùng.</p>
      </div>

      <figure
        ref={heroArtRef}
        className="hero-art"
      >
        <div className="art-topline"><span>GÓC NHÌN CỦA BẠN</span><span>01 / 03</span></div>
        <div className="chess-scene">
          <Image
            src="/assets/chess/horse-reference-pdf-preview.webp"
            alt="Quân Mã màu đồng trước các quân cờ khác trên bàn cờ; ảnh tham chiếu trích từ PDF, chưa phải asset cuối."
            fill
            sizes="(max-width: 620px) calc(100vw - 56px), (max-width: 900px) calc(100vw - 84px), 50vw"
            className="chess-reference-image"
            preload
          />
          <span className="scene-label">ẢNH THAM CHIẾU · CHỜ ASSET GỐC</span>
        </div>
        <figcaption><span>Một việc. Nhiều hướng đi.</span><span className="caption-rule" /><span>DEMO · KHÔNG PHẢI CAM KẾT</span></figcaption>
      </figure>
      <div className="hero-footnote"><span>01 — 04</span><span>GIẢI PHÁP ĐƯỢC HÌNH THÀNH QUA ĐỐI THOẠI</span><span>SCROLL ĐỂ KHÁM PHÁ <ArrowDown aria-hidden="true" size={10} /></span></div>
    </section>
  );
}

function PainSection({
  state,
  dispatch,
}: {
  state: DemoState;
  dispatch: (action: DemoAction) => void;
}) {
  const painGridRef = useScrollReveal<HTMLDivElement>();
  const responseRef = useRef<HTMLDivElement>(null);
  const selectedScenario = demoScenarios.find((scenario) => scenario.id === state.scenarioId)!;

  useGSAP(() => {
    const response = responseRef.current;
    if (!response) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        response,
        { autoAlpha: 0.72, y: 5 },
        { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out", clearProps: "opacity,visibility,transform" },
      );
    });

    return () => media.revert();
  }, { dependencies: [state.scenarioId], revertOnUpdate: true, scope: responseRef });

  return (
    <section className="pain-section section-wrap section-pad" aria-labelledby="pain-title">
      <div className="section-heading">
        <Eyebrow>00 <span className="eyebrow-line" /> Nhận diện tình huống</Eyebrow>
        <h2 id="pain-title">Bạn đang gặp<br /><em>chuyện gì?</em></h2>
        <p>Chọn điều gần với bối cảnh của bạn. Đây chỉ là điểm bắt đầu để xem cách nhiều nguồn lực có thể phối hợp, không phải chẩn đoán.</p>
      </div>
      <div className="pain-side">
        <div className="pain-grid" ref={painGridRef} role="group" aria-label="Chọn một tình huống minh họa">
          {demoScenarios.map((scenario, index) => (
            <button
              className={`pain-card${state.scenarioId === scenario.id ? " is-selected" : ""}`}
              type="button"
              key={scenario.id}
              data-pain={scenario.id}
              aria-pressed={state.scenarioId === scenario.id}
              onClick={() => dispatch({ type: "SELECT_SCENARIO", scenarioId: scenario.id })}
            >
              <span className="pain-number">0{index + 1}</span>
              <span className="pain-icon" aria-hidden="true">{index === 0 ? <ArrowUpRight size={17} /> : index === 1 ? "♜" : <Sparkles size={16} />}</span>
              <span className="pain-card-title">{scenario.painLabel}</span>
              <span className="pain-select">{state.scenarioId === scenario.id ? "Đang chọn" : "Chọn tình huống"}<ArrowUpRight aria-hidden="true" size={10} /></span>
            </button>
          ))}
        </div>
        <div className="pain-response" ref={responseRef} aria-live="polite" aria-atomic="true">
          <span className="response-mark" aria-hidden="true"><MoveRight size={16} /></span>
          <div><p className="response-kicker">Một việc kinh doanh có thể có nhiều điểm tiếp cận.</p><p>{selectedScenario.response}</p></div>
          <DemoStamp />
        </div>
      </div>
    </section>
  );
}

function ResourceSection() {
  const resourceGridRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="why-section section-wrap section-pad" id="why" aria-labelledby="why-title">
      <div className="section-topline"><Eyebrow>01 <span className="eyebrow-line" /> Nguồn lực có thể phối hợp</Eyebrow><span className="section-index">KHÔNG CẦN BẮT ĐẦU LẠI TỪ ĐẦU</span></div>
      <div className="why-heading-row">
        <h2 id="why-title">Bạn không phải bỏ<br /><em>những gì mình đã có.</em></h2>
        <p>Mỗi cách làm có một vai trò. Một hướng giải có thể cần một cấu hình team khác; bạn có thể giữ team hiện tại và bổ sung phần còn thiếu.</p>
      </div>
      <div className="resource-grid" ref={resourceGridRef}>
        {resources.map((resource, index) => (
          <article className={`resource-card${index === 0 ? " resource-current" : ""}`} key={resource.id}>
            <div className="resource-card-head"><span className="resource-number">0{index + 1}</span><span className="resource-symbol" aria-hidden="true">{resource.symbol}</span></div>
            <p className="resource-type">{resource.type}</p><h3>{resource.name}</h3>
            <p>{resource.detail}</p>
            <span className="resource-tag">{resource.tag}</span>
          </article>
        ))}
      </div>
      <div className="coordination-note"><span className="coordination-icon" aria-hidden="true"><MoveRight size={20} /></span><p><strong>Điều quan trọng là cách phối hợp.</strong> Partner chuyên môn đề xuất hướng và nguồn lực phù hợp. Client giữ quyền quyết định về phạm vi, team và cam kết.</p><DemoStamp>DEMO<br />KHÁI NIỆM</DemoStamp></div>
    </section>
  );
}

function FlowSection({
  state,
  dispatch,
}: {
  state: DemoState;
  dispatch: (action: DemoAction) => void;
}) {
  const builderRef = useScrollReveal<HTMLDivElement>();
  const dealPreviewRef = useRef<HTMLElement>(null);
  const selectedScenario = demoScenarios.find((scenario) => scenario.id === state.scenarioId)!;
  const selectedSolution = selectedScenario.solutions.find((solution) => solution.id === state.solutionId);
  const selectedConfiguration = selectedSolution?.configurations.find((configuration) => configuration.id === state.configurationId);
  const selectedResourceLabels = selectedConfiguration?.resources.map((resource) => resourceLabels[resource]) ?? [];

  useGSAP(() => {
    const builder = builderRef.current;
    if (!builder) return;

    const items = gsap.utils.toArray<HTMLElement>(".direction-button, .configuration-option", builder);
    if (!items.length) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.045, ease: "power2.out", clearProps: "opacity,visibility,transform" },
      );
    });

    return () => media.revert();
  }, {
    dependencies: [state.scenarioId, state.solutionId],
    revertOnUpdate: true,
    scope: builderRef,
  });

  useGSAP(() => {
    const preview = dealPreviewRef.current;
    if (!preview) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        preview,
        { autoAlpha: 0.78, y: 7 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out", clearProps: "opacity,visibility,transform" },
      );
    });

    return () => media.revert();
  }, {
    dependencies: [state.scenarioId, state.solutionId, state.configurationId],
    revertOnUpdate: true,
    scope: dealPreviewRef,
  });

  return (
    <section className="flow-section section-wrap section-pad" id="flow" aria-labelledby="flow-title">
      <div className="section-topline"><Eyebrow>02 <span className="eyebrow-line" /> Từ việc đến Deal</Eyebrow><span className="demo-inline"><span aria-hidden="true">●</span> TẤT CẢ VÍ DỤ LÀ DEMO</span></div>
      <div className="flow-heading-row">
        <div><h2 id="flow-title">Một việc. Những hướng<br /><em>giải khác nhau.</em></h2><p className="flow-intro">Chọn một tình huống, xem các hướng giải và cấu hình team giả định. Không có Partner, báo giá hay kết quả thực được đại diện ở đây.</p></div>
        <div className="flow-aside"><span className="aside-num">4</span><span>bước để làm rõ<br />một Deal</span></div>
      </div>

      <div className="flow-steps" aria-label="Các bước hình thành Deal">
        <div className="flow-step is-complete" data-step="1"><span>01</span><b>Việc</b></div><ArrowRight className="step-arrow" aria-hidden="true" size={13} />
        <div className={`flow-step${state.solutionId ? " is-complete" : " is-active"}`} data-step="2" aria-current={!state.solutionId ? "step" : undefined}><span>02</span><b>Partner đề xuất</b></div><ArrowRight className="step-arrow" aria-hidden="true" size={13} />
        <div className={`flow-step${state.configurationId ? " is-complete" : state.solutionId ? " is-active" : ""}`} data-step="3" aria-current={state.solutionId && !state.configurationId ? "step" : undefined}><span>03</span><b>Hướng giải + team</b></div><ArrowRight className="step-arrow" aria-hidden="true" size={13} />
        <div className={`flow-step${state.configurationId ? " is-active" : ""}`} data-step="4" aria-current={state.configurationId ? "step" : undefined}><span>04</span><b>DEAL</b></div>
      </div>

      <div className="flow-builder" ref={builderRef}>
        <div className="builder-controls">
          <div className="builder-block">
            <div className="builder-label"><span className="builder-step">A</span><div><p>CHỌN VIỆC</p><h3>Tình huống của bạn</h3></div></div>
            <p className="builder-help">Đổi tình huống để làm mới các hướng giải và cấu hình team.</p>
            <div className="choice-list" role="group" aria-label="Chọn việc kinh doanh">
              {demoScenarios.map((scenario) => (
                <button
                  className={`choice-button${state.scenarioId === scenario.id ? " is-selected" : ""}`}
                  type="button"
                  key={scenario.id}
                  aria-pressed={state.scenarioId === scenario.id}
                  onClick={() => dispatch({ type: "SELECT_SCENARIO", scenarioId: scenario.id })}
                >
                  <span className="choice-radio" aria-hidden="true" />{scenario.problem}
                </button>
              ))}
            </div>
          </div>

          <div className="builder-block">
            <div className="builder-label"><span className="builder-step">B</span><div><p>PARTNER CHUYÊN MÔN ĐỀ XUẤT · DEMO</p><h3>Các hướng có thể xem xét</h3></div></div>
            <p className="builder-help">Một tình huống có thể có nhiều hướng. Đây là ví dụ giả định, không phải khuyến nghị.</p>
            <div className="direction-list" role="group" aria-label="Chọn một hướng giải minh họa">
              {selectedScenario.solutions.map((solution, index) => (
                <button
                  className={`direction-button${state.solutionId === solution.id ? " is-selected" : ""}`}
                  type="button"
                  key={solution.id}
                  aria-pressed={state.solutionId === solution.id}
                  onClick={() => dispatch({ type: "SELECT_SOLUTION", solutionId: solution.id })}
                >
                  <span>0{index + 1}</span><span><b>{solution.title}</b><small>{solution.description}</small></span><span className="direction-check" aria-hidden="true"><Check size={10} /></span>
                </button>
              ))}
            </div>
          </div>

          <div className="builder-block team-block">
            <div className="builder-label"><span className="builder-step">C</span><div><p>CLIENT CHỌN CẤU HÌNH</p><h3>Nhiều cách ghép team</h3></div></div>
            <p className="builder-help">Các cấu hình dưới đây chỉ để minh họa; Client quyết định sau khi làm rõ vai trò và phạm vi.</p>
            {selectedSolution ? (
              <div className="team-options configuration-options" role="group" aria-label="Chọn cấu hình team minh họa">
                {selectedSolution.configurations.map((configuration) => (
                  <button
                    className={`team-option configuration-option${state.configurationId === configuration.id ? " is-selected" : ""}`}
                    type="button"
                    key={configuration.id}
                    data-configuration={configuration.id}
                    aria-pressed={state.configurationId === configuration.id}
                    onClick={() => dispatch({ type: "SELECT_CONFIGURATION", configurationId: configuration.id })}
                  >
                    <span className="team-check" aria-hidden="true"><Check size={9} /></span>
                    <span><b>{configuration.title}</b><small>{configuration.resources.map((resource) => resourceLabels[resource]).join(" + ")}</small></span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="configuration-prompt" role="status">Chọn một hướng giải để xem các cấu hình team minh họa.</p>
            )}
          </div>
        </div>

        <aside ref={dealPreviewRef} className="deal-preview" aria-labelledby="deal-title" aria-live="polite" aria-atomic="true">
          <div className="deal-top"><span className="deal-mark" aria-hidden="true">E</span><DemoStamp /></div>
          <p className="deal-kicker">CẤU HÌNH ĐANG XEM</p><h3 id="deal-title">Một Deal cần rõ điều gì?</h3>
          <div className="deal-situation"><span>VIỆC</span><p>{selectedScenario.problem}</p></div>
          <div className="deal-situation"><span>HƯỚNG MINH HỌA</span><p>{selectedSolution?.title ?? "Chưa chọn hướng giải"}</p></div>
          <div className="deal-situation"><span>NGUỒN LỰC ĐANG CHỌN</span><div className="team-chips">{(selectedResourceLabels.length ? selectedResourceLabels : ["Chưa chọn cấu hình"]).map((team) => <span className="team-chip" key={team}>{team}</span>)}</div></div>
          <div className="deal-divider" />
          <p className="deal-roles"><b>Partner</b> đề xuất hướng. <b>Client</b> quyết định.</p>
          <ul className="deal-checklist">
            {(selectedConfiguration?.roleDescriptions ?? ["Chọn cấu hình để xem vai trò minh họa."]).map((description) => <li key={description}>{description}</li>)}
            <li>Deal Lead có thể là một Partner.</li>
          </ul>
          <p className="deal-disclaimer">Ví dụ giao diện, không phải đề xuất thực. Không có giá, Partner sẵn có hay kết quả được bảo đảm.</p>
        </aside>
      </div>
      <div className="flow-footer"><span className="flow-footer-icon" aria-hidden="true"><CircleHelp size={19} /></span><p><strong>Không có cấu hình “tối ưu tự động”.</strong> Một hướng có thể có nhiều cấu hình team. Client quyết định sau khi làm rõ vai trò, điều kiện và cam kết.</p></div>
    </section>
  );
}

function StartSection() {
  return (
    <section className="start-section section-wrap section-pad" id="start" aria-labelledby="start-title">
      <div className="start-panel">
        <div className="start-copy">
          <Eyebrow><span className="eyebrow-line" />03 — Bước tiếp theo</Eyebrow>
          <h2 id="start-title">Bạn muốn<br /><em>bắt đầu thế nào?</em></h2>
          <p>Chọn cách chia sẻ bối cảnh phù hợp. Hai form đang ẩn cho đến khi bạn mở lựa chọn. Đây là bản DEMO; vui lòng không nhập thông tin cá nhân thật.</p>
          <WorkTrigger>Mở việc <ArrowUpRight aria-hidden="true" size={14} /></WorkTrigger>
        </div>
        <div className="start-aside">
          <div className="start-seal" aria-hidden="true"><span>MỞ</span><span>VIỆC</span><ArrowUpRight className="seal-arrow" size={13} /></div>
          <div className="start-note"><span className="note-rule" /><p>Gửi form không đồng nghĩa đã được chấp nhận, có lịch hẹn hay phải thanh toán.</p></div>
        </div>
      </div>
      <div className="start-safety"><CircleHelp aria-hidden="true" size={13} /><p>Preview nội bộ · Form mô phỏng · Không gửi dữ liệu, không tạo hồ sơ, không thu tiền.</p></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a className="wordmark footer-wordmark" href="#top"><span className="wordmark-mark" aria-hidden="true">E</span><span>Giải pháp của<br className="wordmark-break" /> Ecom’s Diary</span></a>
      <p className="footer-message">Một việc kinh doanh.<br />Nhiều cách ghép team.</p>
      <WorkTrigger variant="outline" className="footer-cta">Mở việc <ArrowUpRight aria-hidden="true" size={13} /></WorkTrigger>
      <div className="footer-bottom"><span>© 2026 · BẢN PREVIEW TƯƠNG TÁC</span><span>CHỜ FOUNDER DUYỆT · KHÔNG PUBLIC</span><a href="#top">Về đầu trang ↑</a></div>
    </footer>
  );
}

function DialogFallback({ restoreFocus }: { restoreFocus: () => void }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay" />
      <Dialog.Content className="work-dialog" onCloseAutoFocus={(event) => {
        event.preventDefault();
        restoreFocus();
      }}>
        <Dialog.Title className="sr-only">Đang mở bản xem trước</Dialog.Title>
        <Dialog.Description className="sr-only">Luồng Mở việc DEMO, không gửi dữ liệu.</Dialog.Description>
        <div className="dialog-shell">
          <div className="dialog-topbar">
            <span className="wordmark dialog-wordmark"><span className="wordmark-mark" aria-hidden="true">E</span><span>Giải pháp của Ecom’s Diary</span></span>
            <Dialog.Close asChild><button className="icon-button" type="button" aria-label="Đóng cửa sổ"><X aria-hidden="true" size={18} /></button></Dialog.Close>
          </div>
          <div className="dialog-content"><p className="dialog-intro" role="status">Đang mở lựa chọn bắt đầu…</p></div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export default function LandingPage() {
  const [demoState, dispatch] = useReducer(demoReducer, initialDemoState);
  const [dialogOpen, setDialogOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusContext = {
    registerTrigger: (trigger: HTMLButtonElement) => { triggerRef.current = trigger; },
    restoreTrigger: () => triggerRef.current?.focus(),
  };

  return (
    <>
      <a className="skip-link" href="#main">Bỏ qua điều hướng</a>
      <DialogFocusContext.Provider value={focusContext}>
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Header />
          <main id="main">
            <Hero />
            <PainSection state={demoState} dispatch={dispatch} />
            <ResourceSection />
            <FlowSection state={demoState} dispatch={dispatch} />
            <StartSection />
          </main>
          <Footer />
          {dialogOpen && <Suspense fallback={<DialogFallback restoreFocus={focusContext.restoreTrigger} />}><StartDialogContent key="open" /></Suspense>}
        </Dialog.Root>
      </DialogFocusContext.Provider>
    </>
  );
}
