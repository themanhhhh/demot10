"use client";

import { lazy, Suspense, useContext, useReducer, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, KeyboardEvent, ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  MoveRight,
  Sparkles,
  X,
} from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { demoScenarios, resourceLabels } from "@/features/deal-demo/scenarios";
import { demoReducer, initialDemoState } from "@/features/deal-demo/reducer";
import type { DemoAction, DemoState } from "@/features/deal-demo/model";
import { DialogFocusContext } from "@/contexts/dialog-focus-context";
import { usePointerSpotlight } from "@/hooks/use-pointer-spotlight";

const StartDialogContent = lazy(() => import("@/components/start-dialog").then((module) => ({ default: module.StartDialogContent })));

gsap.registerPlugin(ScrollTrigger, useGSAP);

const resources = [
  { id: "inhouse", name: "In-house", type: "NỘI LỰC", detail: "Người hiểu sản phẩm, khách hàng và nhịp vận hành bên trong doanh nghiệp.", tag: "Nền tảng bạn đang có", symbol: "◒" },
  { id: "agency", name: "Agency", type: "ĐỘI NGŨ CHUYÊN MÔN", detail: "Một nhóm có thể cùng triển khai các đầu việc liên kết trong phạm vi đã thống nhất.", tag: "Bổ sung năng lực triển khai", symbol: "▤" },
  { id: "freelancer", name: "Freelancer", type: "CHUYÊN GIA ĐỘC LẬP", detail: "Một chuyên môn cụ thể, có thể tham gia theo phạm vi và thời điểm phù hợp.", tag: "Bổ sung một năng lực cụ thể", symbol: "✳" },
] as const;

type ResourceId = (typeof resources)[number]["id"];

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function PreviewStamp({ children = <>VÍ DỤ<br />GIẢ ĐỊNH</> }: { children?: ReactNode }) {
  return <span className="preview-stamp">{children}</span>;
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

function SpotlightButton({ className = "", children, ...props }: ComponentPropsWithoutRef<"button">) {
  const { regionRef, spotlightRef } = usePointerSpotlight<HTMLButtonElement>();

  return (
    <button ref={regionRef} className={`pointer-spotlight-region spotlight-button ${className}`} {...props}>
      {children}
      <span ref={spotlightRef} className="pointer-spotlight" aria-hidden="true" />
    </button>
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
  const heroCopyRef = useScrollReveal<HTMLDivElement>(".eyebrow, h1, .hero-intro, .hero-actions, .hero-note");
  const heroArtRef = useScrollReveal<HTMLElement>(".chess-reference-image");
  const chessSceneSpotlight = usePointerSpotlight<HTMLDivElement>();

  return (
    <section className="hero section-wrap" id="top" aria-labelledby="hero-title">
      <div className="hero-copy" ref={heroCopyRef}>
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
        <div className="chess-scene pointer-spotlight-region" ref={chessSceneSpotlight.regionRef}>
          <Image
            src="/assets/chess/hero-chess-original.png"
            alt="Quân Mã bằng đồng nổi bật trên bàn cờ, phía sau là các quân cờ được làm mờ."
            fill
            sizes="(max-width: 620px) calc(100vw - 56px), (max-width: 900px) calc(100vw - 84px), 50vw"
            className="chess-reference-image"
            preload
          />
          <span ref={chessSceneSpotlight.spotlightRef} className="pointer-spotlight" aria-hidden="true" />
          <span className="scene-label">MỘT VIỆC · NHIỀU HƯỚNG ĐI</span>
        </div>
      <figcaption><span>Một việc. Nhiều hướng đi.</span><span className="caption-rule" /><span>GÓC NHÌN CHIẾN LƯỢC</span></figcaption>
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
  const headingRef = useScrollReveal<HTMLDivElement>(".eyebrow, h2, p");
  const painGridRef = useScrollReveal<HTMLDivElement>(".pain-card");
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
      <div className="section-heading" ref={headingRef}>
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
          <PreviewStamp />
        </div>
      </div>
    </section>
  );
}

function ResourceSection() {
  const [selectedResources, setSelectedResources] = useState<ResourceId[]>(["inhouse"]);
  const headingRef = useScrollReveal<HTMLDivElement>(".section-topline, .why-heading-row h2, .why-heading-row > p");
  const resourceGridRef = useScrollReveal<HTMLDivElement>(".resource-card");
  const coordinationRef = useScrollReveal<HTMLDivElement>();
  const selectedNames = resources.filter((resource) => selectedResources.includes(resource.id)).map((resource) => resource.name);
  const selectedExternalNames = resources.filter((resource) => resource.id !== "inhouse" && selectedResources.includes(resource.id)).map((resource) => resource.name);
  const coordinationCopy = selectedResources.length === 0
    ? "Chọn nguồn lực có thể tham gia. Client quyết định cấu hình theo phạm vi công việc."
    : selectedResources.length === 1 && selectedResources[0] === "inhouse"
      ? "Team hiện tại có thể tiếp tục tham gia. Client quyết định phần việc nào cần bổ sung nguồn lực ngoài."
      : selectedResources.includes("inhouse")
        ? `Có thể giữ team hiện tại và bổ sung ${selectedExternalNames.join(" + ")}. Partner chuyên môn đề xuất hướng; Client quyết định phạm vi, vai trò và cam kết.`
        : `Các nguồn lực ${selectedNames.join(" + ")} có thể phối hợp theo phạm vi đã thống nhất. Partner chuyên môn đề xuất hướng; Client quyết định cấu hình và cam kết.`;

  function toggleResource(id: ResourceId) {
    setSelectedResources((current) => current.includes(id)
      ? current.filter((resource) => resource !== id)
      : [...current, id]);
  }

  function handleResourceKeyDown(event: KeyboardEvent<HTMLElement>, id: ResourceId) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleResource(id);
  }

  return (
    <section className="why-section section-wrap section-pad" id="why" aria-labelledby="why-title">
      <div ref={headingRef}>
        <div className="section-topline"><Eyebrow>01 <span className="eyebrow-line" /> Nguồn lực có thể phối hợp</Eyebrow><span className="section-index">KHÔNG CẦN BẮT ĐẦU LẠI TỪ ĐẦU</span></div>
        <div className="why-heading-row">
          <h2 id="why-title">Bạn không phải bỏ<br /><em>những gì mình đã có.</em></h2>
          <p>Mỗi cách làm có một vai trò. Một hướng giải có thể cần một cấu hình team khác; bạn có thể giữ team hiện tại và bổ sung phần còn thiếu.</p>
        </div>
      </div>
      <div className="resource-grid" ref={resourceGridRef}>
        {resources.map((resource, index) => {
          const selected = selectedResources.includes(resource.id);
          return <ResourceCard key={resource.id} resource={resource} index={index} selected={selected} onToggle={toggleResource} onKeyDown={handleResourceKeyDown} />;
        })}
      </div>
      <div ref={coordinationRef} className="coordination-note" aria-live="polite" aria-atomic="true"><span className="coordination-icon" aria-hidden="true"><MoveRight size={20} /></span><div><p><strong>{selectedNames.length ? `Nguồn lực đang chọn: ${selectedNames.join(" + ")}` : "Chưa chọn nguồn lực"}</strong></p><p>{coordinationCopy}</p></div><span className="coordination-tag">NGUYÊN TẮC</span></div>
    </section>
  );
}

function ResourceCard({
  resource,
  index,
  selected,
  onToggle,
  onKeyDown,
}: {
  resource: (typeof resources)[number];
  index: number;
  selected: boolean;
  onToggle: (id: ResourceId) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>, id: ResourceId) => void;
}) {
  const { regionRef, spotlightRef } = usePointerSpotlight<HTMLElement>();

  return (
    <article
      ref={regionRef}
      className={`resource-card resource-choice pointer-spotlight-region${selected ? " is-selected" : ""}`}
      data-resource={resource.id}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onToggle(resource.id)}
      onKeyDown={(event) => onKeyDown(event, resource.id)}
    >
      <div className="resource-card-head"><span className="resource-number">0{index + 1}</span><span className="resource-symbol" aria-hidden="true">{resource.symbol}</span></div>
      <p className="resource-type">{resource.type}</p><h3>{resource.name}</h3>
      <p>{resource.detail}</p>
      <span className="resource-tag">{resource.tag}</span>
      <span className="resource-select-state">{selected ? "Đang chọn · nhấn để bỏ chọn" : "Chọn để xem phối hợp"}</span>
      <span ref={spotlightRef} className="pointer-spotlight" aria-hidden="true" />
    </article>
  );
}

function FlowSection({
  state,
  dispatch,
}: {
  state: DemoState;
  dispatch: (action: DemoAction) => void;
}) {
  const flowHeadingRef = useScrollReveal<HTMLElement>(".section-topline, .flow-heading-row h2, .flow-intro, .flow-aside, .flow-steps");
  const builderRef = useScrollReveal<HTMLDivElement>(".builder-block, .deal-preview");
  const dealPreviewRef = useRef<HTMLElement>(null);
  const previousBuilderSelectionRef = useRef({ scenarioId: state.scenarioId, solutionId: state.solutionId });
  const previousDealSelectionRef = useRef({ scenarioId: state.scenarioId, solutionId: state.solutionId, configurationId: state.configurationId });
  const selectedScenario = demoScenarios.find((scenario) => scenario.id === state.scenarioId)!;
  const selectedSolution = selectedScenario.solutions.find((solution) => solution.id === state.solutionId);
  const selectedConfiguration = selectedSolution?.configurations.find((configuration) => configuration.id === state.configurationId);
  const selectedResourceLabels = selectedConfiguration?.resources.map((resource) => resourceLabels[resource]) ?? [];

  useGSAP(() => {
    const builder = builderRef.current;
    if (!builder) return;

    const previous = previousBuilderSelectionRef.current;
    previousBuilderSelectionRef.current = { scenarioId: state.scenarioId, solutionId: state.solutionId };
    const selector = previous.scenarioId !== state.scenarioId
      ? ".direction-button, .configuration-prompt"
      : previous.solutionId !== state.solutionId
        ? ".configuration-option, .configuration-prompt"
        : null;
    if (!selector) return;

    const items = Array.from(builder.querySelectorAll<HTMLElement>(selector));
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
    const previous = previousDealSelectionRef.current;
    previousDealSelectionRef.current = {
      scenarioId: state.scenarioId,
      solutionId: state.solutionId,
      configurationId: state.configurationId,
    };
    if (
      previous.scenarioId === state.scenarioId &&
      previous.solutionId === state.solutionId &&
      previous.configurationId === state.configurationId
    ) return;

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
    <section ref={flowHeadingRef} className="flow-section section-wrap section-pad" id="flow" aria-labelledby="flow-title">
       <div className="section-topline"><Eyebrow>02 <span className="eyebrow-line" /> Từ việc đến Deal</Eyebrow></div>
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
                <SpotlightButton
                  className={`choice-button${state.scenarioId === scenario.id ? " is-selected" : ""}`}
                  type="button"
                  key={scenario.id}
                  aria-pressed={state.scenarioId === scenario.id}
                  onClick={() => dispatch({ type: "SELECT_SCENARIO", scenarioId: scenario.id })}
                >
                  <span className="choice-radio" aria-hidden="true" />{scenario.problem}
                </SpotlightButton>
              ))}
            </div>
          </div>

          <div className="builder-block">
            <div className="builder-label"><span className="builder-step">B</span><div><p>CƠ CHẾ PARTNER ĐỀ XUẤT · MINH HỌA</p><h3>Các hướng có thể xem xét</h3></div></div>
            <p className="builder-help">Một tình huống có thể có nhiều hướng. Các hướng dưới đây chưa phải khuyến nghị cho doanh nghiệp thật.</p>
            <div className="direction-list" role="group" aria-label="Chọn một hướng giải minh họa">
              {selectedScenario.solutions.map((solution, index) => (
                <SpotlightButton
                  className={`direction-button${state.solutionId === solution.id ? " is-selected" : ""}`}
                  type="button"
                  key={solution.id}
                  aria-pressed={state.solutionId === solution.id}
                  onClick={() => dispatch({ type: "SELECT_SOLUTION", solutionId: solution.id })}
                >
                  <span>0{index + 1}</span><span><b>{solution.title}</b><small>{solution.description}</small></span><span className="direction-check" aria-hidden="true"><Check size={10} /></span>
                </SpotlightButton>
              ))}
            </div>
          </div>

          <div className="builder-block team-block">
            <div className="builder-label"><span className="builder-step">C</span><div><p>CLIENT CHỌN CẤU HÌNH</p><h3>Nhiều cách ghép team</h3></div></div>
            <p className="builder-help">Một hướng có thể có nhiều cấu hình team. Client quyết định sau khi làm rõ vai trò, phạm vi và cam kết.</p>
            {selectedSolution ? (
              <div className="team-options configuration-options" role="group" aria-label="Chọn cấu hình team minh họa">
                {selectedSolution.configurations.map((configuration) => (
                  <SpotlightButton
                    className={`team-option configuration-option${state.configurationId === configuration.id ? " is-selected" : ""}`}
                    type="button"
                    key={configuration.id}
                    data-configuration={configuration.id}
                    aria-pressed={state.configurationId === configuration.id}
                    onClick={() => dispatch({ type: "SELECT_CONFIGURATION", configurationId: configuration.id })}
                  >
                    <span className="team-check" aria-hidden="true"><Check size={9} /></span>
                    <span><b>{configuration.title}</b><small>{configuration.resources.map((resource) => resourceLabels[resource]).join(" + ")}</small></span>
                  </SpotlightButton>
                ))}
              </div>
            ) : (
              <p className="configuration-prompt" role="status">Chọn một hướng giải để xem các cấu hình team minh họa.</p>
            )}
          </div>
        </div>

        <aside ref={dealPreviewRef} className="deal-preview" aria-labelledby="deal-title" aria-live="polite" aria-atomic="true">
          <div className="deal-top"><span className="deal-mark" aria-hidden="true">E</span><PreviewStamp>CẤU HÌNH<br />THAM KHẢO</PreviewStamp></div>
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
          <p className="deal-disclaimer">Bản trình bày minh họa, không phải đề xuất hay Deal đã hình thành. Chưa có Partner được xác nhận, giá hoặc kết quả bảo đảm.</p>
        </aside>
      </div>
    </section>
  );
}

function StartSection() {
  const startPanelRef = useScrollReveal<HTMLDivElement>(".start-copy > *");
  const startOrbitRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const orbit = startOrbitRef.current;
    if (!orbit) return;

    const track = orbit.querySelector<HTMLElement>(".start-orbit__track");
    const rings = orbit.querySelectorAll<SVGCircleElement>(".start-orbit__ring");
    const core = orbit.querySelector<SVGSVGElement>(".start-orbit__planet");
    if (!track || !rings.length || !core) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: orbit,
          start: "top 82%",
          once: true,
        },
      });

      intro
        .fromTo(
          rings,
          { strokeDashoffset: 1, autoAlpha: 0 },
          { strokeDashoffset: 0, autoAlpha: 1, duration: 1.05, stagger: 0.16, ease: "power2.out" },
        )
        .fromTo(core, { scale: 0.78, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.55");

      const rotation = gsap.to(track, {
        rotation: 360,
        duration: 34,
        ease: "none",
        repeat: -1,
        paused: true,
        transformOrigin: "50% 50%",
      });

      const visibility = ScrollTrigger.create({
        trigger: orbit,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => {
          orbit.classList.toggle("is-active", isActive);
          if (isActive) rotation.play();
          else rotation.pause();
        },
      });
      if (visibility.isActive) rotation.play();

      return () => {
        orbit.classList.remove("is-active");
        visibility.kill();
        rotation.kill();
        intro.kill();
      };
    });

    return () => media.revert();
  }, { scope: startOrbitRef });

  return (
    <section className="start-section section-wrap section-pad" id="start" aria-labelledby="start-title">
      <div className="start-panel" ref={startPanelRef}>
        <div className="start-copy">
          <Eyebrow><span className="eyebrow-line" />03 — Bước tiếp theo</Eyebrow>
          <h2 id="start-title">Bạn muốn<br /><em>bắt đầu thế nào?</em></h2>
          <p>Chọn cách chia sẻ bối cảnh phù hợp. Ecom’s Diary sẽ xem xét thông tin bạn gửi và liên hệ lại theo cách bạn đã cung cấp.</p>
          <WorkTrigger>Mở việc <ArrowUpRight aria-hidden="true" size={14} /></WorkTrigger>
        </div>
        <div className="start-aside" aria-hidden="true">
          <div className="start-orbit" ref={startOrbitRef}>
            <div className="start-orbit__track">
              <svg className="start-orbit__svg" viewBox="0 0 280 280" focusable="false">
                <circle className="start-orbit__ring start-orbit__ring--outer" cx="140" cy="140" r="122" pathLength="1" />
                <circle className="start-orbit__ring start-orbit__ring--middle" cx="140" cy="140" r="96" pathLength="1" />
                <circle className="start-orbit__ring start-orbit__ring--inner" cx="140" cy="140" r="69" pathLength="1" />
                <circle className="start-orbit__node start-orbit__node--north" cx="140" cy="18" r="3" />
                <circle className="start-orbit__node start-orbit__node--southwest" cx="54" cy="226" r="2.5" />
                <circle className="start-orbit__node start-orbit__node--northeast" cx="223" cy="83" r="2" />
              </svg>
              <span className="start-orbit__satellite" />
            </div>
            <div className="start-orbit__core">
              <svg className="start-orbit__planet" viewBox="0 0 64 64" focusable="false">
                <ellipse cx="32" cy="32" rx="27" ry="10" transform="rotate(-28 32 32)" fill="none" stroke="#a88c86" strokeWidth="1.2" />
                <circle cx="32" cy="32" r="14" fill="#d9c5b9" stroke="#782d3e" strokeWidth="1.2" />
                <path d="M21 29c3-5 9-8 15-7-4 2-5 5-4 8 1 2 0 4-2 5-3 2-7 1-10-1 1-1 1-3 1-5Z" fill="#b7978e" opacity=".68" />
                <circle cx="39" cy="38" r="2" fill="#a98178" opacity=".75" />
                <circle cx="25" cy="38" r="1.4" fill="#f3e9df" />
              </svg>
            </div>
            <span className="start-orbit__glint start-orbit__glint--one" />
            <span className="start-orbit__glint start-orbit__glint--two" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const footerRef = useScrollReveal<HTMLElement>(".footer-wordmark, .footer-message, .footer-description, .footer-kicker, .footer-nav a, .footer-social-list, .footer-action > p, .footer-cta");

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="footer-main">
        <div className="footer-identity">
          <a className="wordmark footer-wordmark" href="#top"><span className="wordmark-mark" aria-hidden="true">E</span><span>Giải pháp của<br className="wordmark-break" /> Ecom’s Diary</span></a>
          <p className="footer-message">Một việc kinh doanh.<br /><em>Nhiều cách ghép team.</em></p>
          <p className="footer-description">Partner đề xuất hướng giải. Client quyết định phạm vi, nguồn lực và cam kết.</p>
        </div>
        <nav className="footer-nav" aria-label="Điều hướng chân trang">
          <span className="footer-kicker">KHÁM PHÁ</span>
          <a href="#why">Vì sao có thể phối hợp</a>
          <a href="#flow">Cách ghép team</a>
          <a href="#start">Các cách bắt đầu</a>
        </nav>
        <div className="footer-connect">
          <span className="footer-kicker">KẾT NỐI</span>
          <ul className="footer-social-list" aria-label="Facebook, Instagram và TikTok">
            <li><span><SiFacebook aria-hidden="true" focusable="false" />Facebook</span></li>
            <li><span><SiInstagram aria-hidden="true" focusable="false" />Instagram</span></li>
            <li><span><SiTiktok aria-hidden="true" focusable="false" />TikTok</span></li>
          </ul>
        </div>
        <div className="footer-action">
          <span className="footer-kicker">BƯỚC TIẾP THEO</span>
          <p>Chia sẻ bối cảnh để bắt đầu xem xét các hướng có thể có.</p>
          <WorkTrigger variant="outline" className="footer-cta">Mở việc <ArrowUpRight aria-hidden="true" size={13} /></WorkTrigger>
        </div>
      </div>
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
        <Dialog.Title className="sr-only">Mở việc</Dialog.Title>
        <Dialog.Description className="sr-only">Đang tải biểu mẫu Mở việc.</Dialog.Description>
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
