import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept<T = any>(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map((originalData: any) => {
        // إذا كان الـ data فيه هيكل pagination (data و meta)
        if (
          originalData &&
          typeof originalData === 'object' &&
          'data' in originalData &&
          'meta' in originalData
        ) {
          return {
            success: true,
            timestamp: new Date().toISOString(),
            ...originalData, // نرجع البيانات كما هي بدون تغليف إضافي
          };
        }

        // إذا كان data عادي
        return {
          success: true,
          timestamp: new Date().toISOString(),
          data: originalData,
        };
      }),
    );
  }
}
