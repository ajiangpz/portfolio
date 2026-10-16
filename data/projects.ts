import type { Locale } from "@/components/locale-provider";

type Localized<T> = Record<Locale, T>;
export type ProjectSection = { title: string; paragraphs: readonly string[] };
export type Project = {
  slug: string;
  code: string;
  short: string;
  title: string;
  scene: "solar" | "mars" | "saturn";
  stack: readonly string[];
  copy: Localized<{
    type: string;
    lead: string;
    body: string;
    status: string;
    scope: string;
    sections: readonly ProjectSection[];
    evidence: string;
  }>;
  links: readonly { label: Localized<string>; href: string }[];
};

// Evidence belongs with content: V3 descriptions are self-reported scope, not measured results.
// RainScope was rechecked against its public README during the V4 implementation.
export const projects: readonly Project[] = [
  {
    slug: "rainscope", code: "OBJ–01", short: "RAIN SCOPE", title: "RainScope", scene: "solar",
    stack: ["Vue 3", "TypeScript", "MapLibre GL", "deck.gl", "ECharts"],
    copy: {
      en: {
        type: "WEATHER VISUALIZATION / CHINA", status: "IN DEVELOPMENT", scope: "PUBLIC PORTFOLIO PROJECT",
        lead: "Weather, rendered as a living spatial system.",
        body: "A China-scale weather map combining radar, forecast fields and a shared timeline. Real observations, model forecasts and demonstration data are identified separately.",
        sections: [
          { title: "Context", paragraphs: ["Weather layers answer different questions: radar shows observations, while model fields describe forecasts. RainScope brings those layers into one navigable map without presenting them as the same kind of evidence.", "The project began with a Shenzhen weather focus. Its current public README describes a China-wide visualization portfolio, including major-city reference points and time-based layer playback."] },
          { title: "Technical approach", paragraphs: ["Vue 3 and TypeScript coordinate the interface. MapLibre GL provides the map and radar raster layer; a deck.gl MapboxOverlay draws precipitation, temperature, humidity, pressure contours and animated wind streams. ECharts supports chart views.", "Open-Meteo supplies forecast data, including a 12 × 8 national overview grid and Best Match / GFS selection. RainViewer supplies radar tiles. A shared timeline coordinates frames, playback speed and model selection."] },
          { title: "Work and outcomes", paragraphs: ["The public project documents an interactive map, layer opacity controls, map picking, model switching and past/current/forecast playback. This case study describes that documented scope; it does not claim measured adoption or performance results."] },
          { title: "Data boundaries", paragraphs: ["City precipitation rankings, risk/warning examples and some fallback fields remain demonstration data. Display frames can interpolate hourly forecasts and do not imply native 15-minute model resolution. The README is the authoritative reference for these limits."] },
        ],
        evidence: "Source: public RainScope README, checked 15 October 2026 (blob f179e4d1bf834b859e8725021c9c7918a58b6f07). The preview URL is published by that README; live data availability is not guaranteed.",
      },
      zh: {
        type: "天气可视化 / 中国区域", status: "持续开发", scope: "公开作品集项目",
        lead: "让天气成为持续运动的空间系统。",
        body: "将雷达、预报场与统一时间轴组织在全国地图中，明确区分真实观测、模型预报与演示数据。",
        sections: [
          { title: "问题背景", paragraphs: ["雷达观测与模型预报回答的问题不同。RainScope 希望在同一张可交互地图中呈现这些图层，同时保留各类数据的来源与语义边界。", "项目最初聚焦深圳天气，当前公开 README 已将范围扩展为中国区域，包含重点城市参考点与气象图层时序播放。"] },
          { title: "技术方案", paragraphs: ["使用 Vue 3 与 TypeScript 协调界面。MapLibre GL 负责底图、地图交互与雷达栅格，deck.gl MapboxOverlay 负责降水、温度、湿度、气压等值线与动态风场；ECharts 支持图表展示。", "Open-Meteo 提供预报数据，包括全国 12 × 8 概览网格与 Best Match / GFS 模型切换；RainViewer 提供雷达瓦片。统一时间轴协调帧切换、播放速度与模型状态。"] },
          { title: "工作与成果", paragraphs: ["公开项目记录了交互地图、图层透明度、地图取点、模型切换以及过去／当前／预报播放等能力。本档案依据这些公开说明整理，不声称未经测量的性能或使用规模。"] },
          { title: "数据边界", paragraphs: ["城市降水排名、风险／预警示例和部分异常兜底场仍属于演示数据。展示帧可能由小时级预报插值得到，不代表原生 15 分钟模型分辨率。具体边界以项目 README 为准。"] },
        ],
        evidence: "来源：RainScope 公开 README，核对于 2026 年 10 月 15 日（blob f179e4d1bf834b859e8725021c9c7918a58b6f07）。预览地址来自该 README，不保证外部实时数据持续可用。",
      },
    },
    links: [
      { label: { en: "SOURCE REPOSITORY", zh: "源码仓库" }, href: "https://github.com/ajiangpz/sz-weather" },
      { label: { en: "PROJECT PREVIEW", zh: "项目预览" }, href: "https://ajiangpz.github.io/sz-weather/" },
      { label: { en: "SOURCE README", zh: "来源 README" }, href: "https://github.com/ajiangpz/sz-weather/blob/deckGL/README.md" },
    ],
  },
  {
    slug: "network-systems", code: "OBJ–02", short: "NETWORK SYSTEMS", title: "Network Systems", scene: "mars",
    stack: ["Vue", "TypeScript", "Data visualization"],
    copy: {
      en: {
        type: "PRODUCT INTERFACE / DEVICE OPS", status: "PROFESSIONAL PRACTICE", scope: "PUBLIC SCOPE SUMMARY",
        lead: "Operational depth without operational noise.",
        body: "Interfaces for ports, VLANs, PoE schedules, diagnostics and live device state, organized around the decisions operators need to make.",
        sections: [
          { title: "Context", paragraphs: ["Network administration brings live device state and configuration controls into the same workflow. Operators need to understand the current condition before changing a port, a VLAN or a power schedule."] },
          { title: "Technical approach", paragraphs: ["The V3 portfolio describes Vue and TypeScript interfaces covering ports, VLANs, PoE schedules, diagnostics and live device state. These responsibilities form the scope of this public work summary.", "This page keeps the discussion at the interface and workflow level. It includes no internal endpoints, customer identifiers, device credentials or unpublished product screenshots."] },
          { title: "Work and outcomes", paragraphs: ["The documented work spans network configuration and operational visibility. Public demonstrations, implementation samples and independently verifiable results have not been supplied, so this page makes no quantitative outcome claims."] },
          { title: "Publication limits", paragraphs: ["A publishable, anonymized example and a more detailed account of individual contributions remain to be added after disclosure permission is confirmed. No public source repository or demo is asserted for this work."] },
        ],
        evidence: "Source: the author's existing V3 portfolio description at commit 237111544ec6af093435bb221946cb09343c1325. Professional scope is self-reported; private implementation has not been independently audited.",
      },
      zh: {
        type: "网络产品 / 设备运维", status: "工程实践", scope: "公开范围概述",
        lead: "保留系统深度，减少操作噪声。",
        body: "围绕真实运维决策组织端口、VLAN、PoE 计划、诊断与实时设备状态。",
        sections: [
          { title: "问题背景", paragraphs: ["网络管理需要在同一工作流中呈现实时状态与配置操作。运维人员应当先理解设备现状，再决定是否调整端口、VLAN 或供电计划。"] },
          { title: "技术方案", paragraphs: ["V3 作品集记录了使用 Vue 与 TypeScript 开发端口、VLAN、PoE 计划、诊断与实时设备状态界面的工作范围。本页以该公开描述为依据。", "此处仅讨论界面职责与操作场景，不展示内部接口、客户标识、设备凭据或未公开的产品截图。"] },
          { title: "工作与成果", paragraphs: ["已记录的工作覆盖网络配置与运行状态展示。当前未提供公开演示、代码样例或可独立核验的结果，因此不添加量化业务成果。"] },
          { title: "公开边界", paragraphs: ["经许可可公开的脱敏案例与个人职责细节仍待补充。本页不声称存在公开源码或项目演示地址。"] },
        ],
        evidence: "来源：作者已有 V3 作品集描述，提交 237111544ec6af093435bb221946cb09343c1325。工程范围为作者自述，未对非公开实现进行独立审计。",
      },
    },
    links: [],
  },
  {
    slug: "agent-lab", code: "OBJ–03", short: "AGENT LAB", title: "Agent Lab", scene: "saturn",
    stack: ["Next.js", "NestJS", "PostgreSQL"],
    copy: {
      en: {
        type: "AI SYSTEMS / TOOL RUNTIME", status: "PROTOTYPE", scope: "ENGINEERING EXPLORATION",
        lead: "Making tool execution easier to inspect.",
        body: "A prototype exploring validated tool calls, execution steps, explicit failure boundaries and durable memory.",
        sections: [
          { title: "Context", paragraphs: ["A tool-using agent needs more than a conversational interface. When a tool fails or receives invalid arguments, the execution path needs to make the failure understandable."] },
          { title: "Technical approach", paragraphs: ["The existing V3 project description names Next.js, NestJS and PostgreSQL, and focuses on argument validation, resilient execution, observable steps, failure boundaries and durable memory.", "These are the prototype's stated engineering concerns. This page does not claim that interruption, recovery or long-term memory have passed production validation."] },
          { title: "Work and outcomes", paragraphs: ["Agent Lab remains a prototype. The available source for this case study is the author's V3 description, rather than a public implementation or a reproducible benchmark. No reliability, latency or deployment claims are made."] },
          { title: "Next evidence to add", paragraphs: ["A public code sample, a reproducible tool-call trace and documented failure cases would make this study more concrete. Those materials and a verified demo link remain to be added."] },
        ],
        evidence: "Source: the author's existing V3 portfolio description at commit 237111544ec6af093435bb221946cb09343c1325. Prototype scope is self-reported; a public repository and production results have not been verified.",
      },
      zh: {
        type: "AI 系统 / 工具运行时", status: "原型阶段", scope: "工程探索",
        lead: "让工具执行过程更容易检查。",
        body: "围绕参数校验、执行步骤、明确失败边界与持久记忆开展的 Agent 原型探索。",
        sections: [
          { title: "问题背景", paragraphs: ["调用工具的 Agent 不只有对话界面。当参数不合法或工具执行失败时，需要能够解释发生了什么，以及失败发生在哪一步。"] },
          { title: "技术方案", paragraphs: ["已有 V3 项目描述列出的技术栈为 Next.js、NestJS 与 PostgreSQL，关注参数校验、可靠执行、步骤观测、失败边界与持久记忆。", "这些是原型声明的工程关注点，不代表中断、恢复或长期记忆已经完成生产验证。"] },
          { title: "工作与成果", paragraphs: ["Agent Lab 仍处于原型阶段。本档案依据作者 V3 描述整理，尚无公开实现或可复现基准作为证据，因此不添加可靠性、时延或部署成果。"] },
          { title: "待补充证据", paragraphs: ["后续可补充公开代码样例、可复现的工具调用轨迹和失败案例。目前这些资料及经核实的演示链接仍待完善。"] },
        ],
        evidence: "来源：作者已有 V3 作品集描述，提交 237111544ec6af093435bb221946cb09343c1325。原型范围为作者自述，尚未核实公开仓库与生产结果。",
      },
    },
    links: [],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
