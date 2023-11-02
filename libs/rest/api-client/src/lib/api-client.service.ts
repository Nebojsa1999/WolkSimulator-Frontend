import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, OperatorFunction, throwError } from 'rxjs';
import { MultiPart, RequestConfig, RequestParamType } from './+model/request.model';
import { ApiResponse } from './+model/response.model';
import { RestConfig } from './+model/rest-config-params.model';
import { ApiClient } from './api-client';
import { MediaFile } from './+model/media-file';
import { HttpError } from './+model/http-error';
import { getHttpErrorType } from './+model/HTTPErrorsEnum';

export class ApiClientService extends ApiClient {
  private readonly baseUrl;

  constructor(private http: HttpClient, restConfig: RestConfig) {
    super();
    if (!restConfig) {
      throw '[ApiClientService] - RestConfig must be provided from the application';
    }
    this.baseUrl = restConfig.baseUrl;
  }

  post<TRequest, TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
    return this.http.post<TResponse>(`${this.baseUrl}${path}`, body, this.formatJsonOptions(config)).pipe(this.mapJsonResponse(), this.parseError());
  }

  put<TRequest, TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
    return this.http.put<TResponse>(`${this.baseUrl}${path}`, body, this.formatJsonOptions(config)).pipe(this.mapJsonResponse(), this.parseError());
  }

  delete<TResponse>(path: string, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
    return this.http.delete<TResponse>(`${this.baseUrl}${path}`, this.formatJsonOptions(config)).pipe(this.mapJsonResponse(), this.parseError());
  }

  get<TResponse>(path: string, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
    if (this.hasJsonResponse(config)) {
      return this.http.get<TResponse>(`${this.baseUrl}${path}`, this.formatJsonOptions(config)).pipe(this.mapJsonResponse(), this.parseError());
    } else {
      const options = {
        headers: this.wrapHeaders(config),
        params: this.beautifyParams(config?.params),
        observe: 'body' as const,
        responseType: 'json' as const,
      };

      if (config?.headers?.responseType) {
        options.responseType = config?.headers?.responseType as any;
      }
      return this.http.get(`${this.baseUrl}${path}`, options).pipe(
        map((response) => {
          const apiResponse: ApiResponse<TResponse> = {
            data: response as TResponse,
            headers: {},
          };

          return apiResponse;
        }),
        this.parseError()
      );
    }
  }

  getMediaFile(
    mediaFile: MediaFile,
    params?: {
      [key in string]: RequestParamType;
    }
  ): Observable<ApiResponse<File>> {
    const internalUrlPrefix = '{{host}}';

    const isInternalUrl = mediaFile.url.startsWith(`${internalUrlPrefix}`);

    const config: RequestConfig = {
      headers: {
        accept: 'application/octet-stream',
      },
      public: !isInternalUrl,
    };

    const options = {
      headers: this.wrapHeaders(config),
      params: this.beautifyParams(params),
      observe: 'response' as const,
      responseType: 'blob' as const,
    };

    const path = isInternalUrl ? `${this.baseUrl}${mediaFile.url.substring(internalUrlPrefix.length)}` : mediaFile.url;

    return this.http.get(path, options).pipe(
      map((response) => {
        if (response.body) {
          const data = new File([response.body], mediaFile.name);
          const apiResponse: ApiResponse<File> = {
            data: data,
            headers: {},
          };

          response.headers.keys().forEach((headerName) => {
            apiResponse.headers[headerName] = response.headers.get(headerName);
          });

          return apiResponse;
        } else {
          throw 'No file found';
        }
      }),
      this.parseError()
    );
  }

  postMultipart<TRequest extends MultiPart[], TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
    const multiPartData = new FormData();

    body.forEach((part) => {
      if (typeof part.content === 'string') {
        multiPartData.append(part.name, new Blob([part.content], { type: 'application/json' }));
      } else {
        multiPartData.append(part.name, part.content, part.content.name);
      }
    });

    return this.http.post<TResponse>(`${this.baseUrl}${path}`, multiPartData, this.formatJsonOptions(config)).pipe(this.mapJsonResponse(), this.parseError());
  }

  putMultipart<TRequest extends MultiPart[], TResponse>(path: string, body: TRequest, config?: RequestConfig): Observable<ApiResponse<TResponse>> {
    const multiPartData = new FormData();

    body.forEach((part) => {
      if (typeof part.content === 'string') {
        multiPartData.append(part.name, new Blob([part.content], { type: 'application/json' }));
      } else {
        multiPartData.append(part.name, part.content, part.content.name);
      }
    });

    return this.http.put<TResponse>(`${this.baseUrl}${path}`, multiPartData, this.formatJsonOptions(config)).pipe(this.mapJsonResponse(), this.parseError());
  }

  private hasJsonResponse(config?: RequestConfig): boolean {
    return !config?.headers?.accept || config?.headers?.accept === 'application/json';
  }

  private formatJsonOptions(config?: RequestConfig) {
    return {
      headers: this.wrapHeaders(config),
      params: this.beautifyParams(config?.params),
      observe: 'response' as const,
    };
  }

  private wrapHeaders(config?: RequestConfig): HttpHeaders {
    const headerRecord: Record<string, string> = {
      Accept: config?.headers?.accept ?? 'application/json',
    };

    if (config?.headers?.contentType) {
      headerRecord['Content-Type'] = config?.headers.contentType;
    }

    if (!config?.public) {
      headerRecord['Authorization'] = ''; // Must be present so the interceptor fills the value.
    }

    return new HttpHeaders(headerRecord);
  }

  private beautifyParams(params?: { [key in string]: RequestParamType }): HttpParams | undefined {
    let httpParams = new HttpParams();

    if (!params) {
      return httpParams;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          httpParams = httpParams.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((arrayValue) => (httpParams = httpParams.append(key, arrayValue)));
        } else {
          throw Error(`Cannot convert to parameters: ${JSON.stringify(value)}`);
        }
      }
    });

    return httpParams;
  }

  mapJsonResponse<TResponse>() {
    return map((response: HttpResponse<TResponse>) => {
      const apiResponse: ApiResponse<TResponse> = {
        data: response.body,
        headers: {},
      };

      response.headers.keys().forEach((headerName) => {
        apiResponse.headers[headerName] = response.headers.get(headerName);
      });

      return apiResponse;
    });
  }

  parseError<TResponse>(): OperatorFunction<TResponse, TResponse> {
    return catchError((errorData: HttpErrorResponse) => {
      let { error } = errorData;

      if (typeof error === 'string') {
        try {
          error = JSON.parse(error);
        } catch (e) {
          console.error('Could not parse error response to JSON, error: ', error);
        }
      }

      const mappedError = new HttpError();
      mappedError.code = errorData.status;
      mappedError.type = getHttpErrorType(errorData.status);
      mappedError.message = error?.message ? error.message : mappedError.type;
      mappedError.response = error;
      mappedError.stack = `
        Type:${mappedError.type}
        Code:${mappedError.code},
        Message: ${mappedError.message}
        ${mappedError.stack}
      `;

      return throwError(() => mappedError as TResponse);
    });
  }
}
