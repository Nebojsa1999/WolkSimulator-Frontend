import {PageParameters} from "@wolk-simulator-frontend/api-client";

export type DeviceParameters = {
  searchFilter?: string;
};

export type DevicePageParameters = DeviceParameters & PageParameters;
