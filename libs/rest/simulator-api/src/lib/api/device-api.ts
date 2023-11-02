import {ApiClient, ApiResponse, Page, RequestConfig} from "@wolk-simulator-frontend/api-client";
import {DevicePageParameters} from "../model/device-parameters";
import {Observable} from "rxjs";
import {Device} from "../model/device";

export class DeviceApi {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  page(params?: DevicePageParameters): Observable<ApiResponse<Page<Device>>> {
    const config: RequestConfig = {
      headers: {
        accept: 'application/vnd.page+json',
      },
      params: params,
    };

    return this.apiClient.get<Page<Device>>(`/api/wis/countries`, config);
  }
}
