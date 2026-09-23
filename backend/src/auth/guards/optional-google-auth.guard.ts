import { ExecutionContext, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalGoogleAuthGuard extends AuthGuard('google') {
  canActivate(context: ExecutionContext) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new ServiceUnavailableException(
        'Login com Google não está configurado neste ambiente. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.',
      );
    }
    return super.canActivate(context);
  }
}
