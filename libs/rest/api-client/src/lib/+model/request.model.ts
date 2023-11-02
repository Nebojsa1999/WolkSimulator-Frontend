export type RequestParamType = string | number | string[] | number[] | boolean;

export type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';

export interface RequestConfig {
  headers?: RequestHeaders;
  params?: {
    [key in string]: RequestParamType;
  };

  public?: boolean;
}

export interface RequestHeaders {
  accept?: string;
  contentType?: string;
  responseType?: ResponseType;
}

export interface MultiPart {
  name: string;
  content: string | File;
}
