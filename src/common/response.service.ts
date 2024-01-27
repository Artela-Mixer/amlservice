import { Injectable } from '@nestjs/common';
import { IHttpResponse } from './http-response.interface';

@Injectable()
export class ResponseService {

  success<T>(data: T, msg: string = 'ok'): IHttpResponse<T> {
    return { code: 0, msg, data };
  }

  error(code: number = -1, msg: string): IHttpResponse<null> {
    return { code, msg, data: null };
  }
}
