import { CredentialCreationOptionsJSON } from '@github/webauthn-json';
import { Body, Controller, Post } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { Register } from './interface/register.dto';

@Controller({
  path: 'auth',
})
export class AuthController {
  @Post('/register')
  async register(
    @Body() body: Register,
  ): Promise<CredentialCreationOptionsJSON> {
    const challenge = randomBytes(32).toString('base64url');
    console.log(body);
    return {
      publicKey: {
        challenge: challenge,
        rp: { name: process.env.RP_NAME },
        user: {
          id: 'YThiMzJjNTgtY2ZiOS00NzAyLThjNDYtNWQ0NzJhODJlYTEw', //  user id in base64url
          name: 'test_user',
          displayName: 'Test User',
        },
        pubKeyCredParams: [],
        // excludeCredentials: registeredCredentials(),
        authenticatorSelection: {
          userVerification: 'preferred',
        },
        extensions: {
          credProps: true,
        },
      },
    };
  }
}
