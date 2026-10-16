export type ScenarioId = "ads" | "team" | "product";

export type ResourceType = "IN_HOUSE" | "AGENCY" | "FREELANCER" | "EXPERT";

export interface TeamConfiguration {
  id: string;
  title: string;
  resources: ResourceType[];
  roleDescriptions: string[];
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  configurations: TeamConfiguration[];
}

export interface BusinessScenario {
  id: ScenarioId;
  painLabel: string;
  problem: string;
  response: string;
  caseResult: string;
  caseSourceUrl: string;
  caseSourceName: string;
  solutions: Solution[];
}

export interface DemoState {
  scenarioId: ScenarioId;
  solutionId: string | null;
  configurationId: string | null;
}

export type DemoAction =
  | { type: "SELECT_SCENARIO"; scenarioId: ScenarioId }
  | { type: "SELECT_SOLUTION"; solutionId: string }
  | { type: "SELECT_CONFIGURATION"; configurationId: string }
  | { type: "RESET" };
