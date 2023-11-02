export interface ApiResponse<TResponse> {
  data: TResponse | null;
  headers: HttpHeaders;
}

export type HttpHeaders = {
  [key: string]: string | null;
};
