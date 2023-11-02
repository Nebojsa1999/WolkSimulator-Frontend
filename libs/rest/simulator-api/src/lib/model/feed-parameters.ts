import {PageParameters} from "@wolk-simulator-frontend/api-client";

export type FeedListParameters = {
  searchFilter?: string;
};

export type FeedPageParameters = FeedListParameters & PageParameters;
