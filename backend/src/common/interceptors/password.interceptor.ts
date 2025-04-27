import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((responseData) => this.removePasswordField(responseData)));
  }
  private removePasswordField(data: any): any {
    {
      if (data instanceof Object) {
        if (Array.isArray(data)) {
          return this.processArray(data);
        }
        for (const key in data) {
          if (key === 'password') {
            delete data[key];
          } else if (data[key] instanceof Object) {
            data[key] = this.removePasswordField(data[key]);
          }
        }
      }
      return data;
    }
  }
  private processArray(arrayData: any[]): any[] {
    return arrayData.map((item) => this.removePasswordField(item));
  }
}
