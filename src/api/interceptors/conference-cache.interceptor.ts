import { Injectable, ExecutionContext, CacheInterceptor } from '@nestjs/common';

@Injectable()
export class ConferenceCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const request = context.getArgByIndex(0);

    if (httpAdapter.getRequestMethod(request) !== 'GET') {
      return undefined;
    }

    const key = httpAdapter.getRequestUrl(request);

    // Different cache for auth-ed users
    return request.user ? '/auth' + key : key;
  }
}
