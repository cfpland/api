import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('bearer') {
  async canActivate(context: ExecutionContext): Promise<true> {
    try {
      await super.canActivate(context);
    } catch (e) {
      // Throw it away
    }

    return true;
  }
}
