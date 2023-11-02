import {PageParameters} from "@wolk-simulator-frontend/api-client";

export type ScenarioListParameters = {
  searchFilter?: string;
};

export type ScenarioPageParameters = ScenarioListParameters & PageParameters;
