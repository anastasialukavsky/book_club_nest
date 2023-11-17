import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext) {
    console.log(this.canActivate.prototype);
    console.log({ context });
    console.log('hi from local auth guard');
    const result = (await super.canActivate(context)) as boolean;
    console.log({ result });
    const request = context.switchToHttp().getRequest();
    console.log({ request });
    await super.logIn(request);
    return result;
  }
}
