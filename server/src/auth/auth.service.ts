import { CredentialCreationOptionsJSON } from '@github/webauthn-json';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { makeUUID } from '@utils';

@Injectable()
export class AuthService {
  async register(
    email: string,
    displayName: string,
  ): Promise<CredentialCreationOptionsJSON> {
    const challenge = randomBytes(32).toString('base64url');

    return {
      publicKey: {
        challenge: challenge,
        rp: { name: process.env.RP_NAME },
        user: {
          id: Buffer.from(makeUUID(email), 'utf8').toString('base64url'),
          name: email,
          displayName: displayName,
        },
        pubKeyCredParams: [],
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
