import { describe, expect, it } from "vitest";
import { demoReducer, initialDemoState } from "./reducer";

describe("demoReducer", () => {
  it("resets the selected solution and configuration when the scenario changes", () => {
    const selected = demoReducer(initialDemoState, { type: "SELECT_SOLUTION", solutionId: "ads-value" });
    const configured = demoReducer(selected, { type: "SELECT_CONFIGURATION", configurationId: "ads-value-freelancer" });

    expect(configured).toEqual({ scenarioId: "ads", solutionId: "ads-value", configurationId: "ads-value-freelancer" });
    expect(demoReducer(configured, { type: "SELECT_SCENARIO", scenarioId: "team" })).toEqual({
      scenarioId: "team",
      solutionId: null,
      configurationId: null,
    });
  });

  it("clears a stale configuration when the solution changes", () => {
    const selected = demoReducer(initialDemoState, { type: "SELECT_SOLUTION", solutionId: "ads-conversion" });
    const configured = demoReducer(selected, { type: "SELECT_CONFIGURATION", configurationId: "ads-conversion-agency" });

    expect(demoReducer(configured, { type: "SELECT_SOLUTION", solutionId: "ads-value" })).toEqual({
      scenarioId: "ads",
      solutionId: "ads-value",
      configurationId: null,
    });
  });

  it("ignores a configuration that does not belong to the selected solution", () => {
    const selected = demoReducer(initialDemoState, { type: "SELECT_SOLUTION", solutionId: "ads-conversion" });

    expect(demoReducer(selected, { type: "SELECT_CONFIGURATION", configurationId: "ads-value-freelancer" })).toBe(selected);
  });

  it("does not select a solution from another scenario", () => {
    expect(demoReducer(initialDemoState, { type: "SELECT_SOLUTION", solutionId: "product-validation" })).toBe(initialDemoState);
  });

  it("resets the flow to its initial demo scenario", () => {
    const changed = demoReducer(initialDemoState, { type: "SELECT_SCENARIO", scenarioId: "product" });

    expect(demoReducer(changed, { type: "RESET" })).toEqual(initialDemoState);
  });
});
