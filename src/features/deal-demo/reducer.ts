import type { DemoAction, DemoState } from "./model";
import { demoScenarios } from "./scenarios";

export const initialDemoState: DemoState = {
  scenarioId: "ads",
  solutionId: null,
  configurationId: null,
};

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "SELECT_SCENARIO": {
      const exists = demoScenarios.some((scenario) => scenario.id === action.scenarioId);
      return exists
        ? { scenarioId: action.scenarioId, solutionId: null, configurationId: null }
        : state;
    }
    case "SELECT_SOLUTION": {
      const scenario = demoScenarios.find((item) => item.id === state.scenarioId);
      const exists = scenario?.solutions.some((solution) => solution.id === action.solutionId);
      return exists
        ? { ...state, solutionId: action.solutionId, configurationId: null }
        : state;
    }
    case "SELECT_CONFIGURATION": {
      const scenario = demoScenarios.find((item) => item.id === state.scenarioId);
      const solution = scenario?.solutions.find((item) => item.id === state.solutionId);
      const exists = solution?.configurations.some((item) => item.id === action.configurationId);
      return exists ? { ...state, configurationId: action.configurationId } : state;
    }
    case "RESET":
      return initialDemoState;
    default:
      return state;
  }
}
