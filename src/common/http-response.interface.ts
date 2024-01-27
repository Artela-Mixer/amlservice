export interface IHttpResponse<T> {
  code: number;
  msg: string;
  data?: T;
}
