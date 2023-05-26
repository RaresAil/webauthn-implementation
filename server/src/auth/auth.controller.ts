import { CredentialCreationOptionsJSON } from '@github/webauthn-json';
import { Body, Controller, Post } from '@nestjs/common';

import { Register } from './interface/register.dto';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/register')
  async register(
    @Body() body: Register,
  ): Promise<CredentialCreationOptionsJSON> {
    return this.service.register(body.email, body.displayName);
  }
}
