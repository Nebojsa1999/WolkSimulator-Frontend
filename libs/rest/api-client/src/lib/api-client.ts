import { Observable, OperatorFunction } from 'rxjs';
import { MultiPart, RequestConfig, RequestParamType } from './+model/request.model';
import { ApiResponse } from './+model/response.model';
import { MediaFile } from './+model/media-file';

export abstract class ApiClient {
  public abstract post<TRequest, TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>>;

  public abstract put<TRequest, TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>>;

  public abstract delete<TResponse>(path: string, config?: RequestConfig): Observable<ApiResponse<TResponse>>;

  public abstract get<TResponse>(path: string, config?: RequestConfig): Observable<ApiResponse<TResponse>>;

  public abstract getMediaFile(
    mediaFile: MediaFile,
    params?: {
      [key in string]: RequestParamType;
    }
  ): Observable<ApiResponse<File>>;

  public abstract postMultipart<TRequest extends MultiPart[], TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>>;

  public abstract putMultipart<TRequest extends MultiPart[], TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>>;
}
