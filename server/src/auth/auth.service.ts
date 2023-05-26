import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Sessions } from '@schemas/Sessions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import {
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
} from '@github/webauthn-json';

import { Keys } from '@schemas/Keys.schema';
import { makeUUID } from '@utils';

import { LoginResponse } from './interface/LoginResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Sessions.name) private sessionsModel: Model<Sessions>,
    @InjectModel(Keys.name) private keysModel: Model<Keys>,
  ) {}

  async requestRegister(
    email: string,
    displayName: string,
  ): Promise<CredentialCreationOptionsJSON> {
    const challenge = randomBytes(32).toString('base64url');
    const userId = makeUUID(email);

    const existing = await this.keysModel.findOne({
      userId,
    });

    if (existing) {
      throw new UnauthorizedException();
    }

    await this.keysModel.create({
      userId,
      challenge,
      type: 'public-key',
      expireAt: this.getDelayedDate(5),
    });

    return {
      publicKey: {
        challenge: challenge,
        rp: { id: process.env.RP_ID, name: process.env.RP_NAME },
        user: {
          id: Buffer.from(makeUUID(email), 'utf8').toString('base64url'),
          name: email,
          displayName: displayName,
        },
        pubKeyCredParams: [],
        authenticatorSelection: {
          userVerification: 'preferred',
        },
        timeout: this.minutesToMilliseconds(5),
        extensions: {
          credProps: true,
        },
      },
    };
  }

  async requestLogin(): Promise<CredentialRequestOptionsJSON> {
    const challenge = randomBytes(32).toString('base64url');

    await this.sessionsModel.create({
      challenge,
      expireAt: this.getDelayedDate(5),
    });

    return {
      publicKey: {
        challenge: challenge,
        rpId: process.env.RP_ID,
        userVerification: 'preferred',
        timeout: this.minutesToMilliseconds(5),
      },
    };
  }

  async register(
    challenge: string,
    type: string,
    keyId: string,
  ): Promise<boolean> {
    const existing = await this.keysModel.findOne({
      challenge,
      type,
    });

    existing.keyId = keyId;
    existing.expireAt = undefined;
    await existing.save();

    return true;
  }

  async login(
    challenge: string,
    keyId: string,
    userId: string,
  ): Promise<LoginResponse> {
    const existing = await this.sessionsModel.findOne({
      challenge,
    });

    if (!existing) {
      throw new UnauthorizedException();
    }

    const existingUser = (
      await this.keysModel.findOne({
        keyId,
        userId,
      })
    )?.toJSON();

    return {
      userId: existingUser.userId,
    };
  }

  async abortRegister(challenge: string): Promise<boolean> {
    const existing = await this.keysModel.deleteMany({
      challenge,
      keyId: {
        $exists: false,
      },
    });

    return existing?.deletedCount >= 1;
  }

  private getDelayedDate = (minutes: number) =>
    new Date(new Date().getTime() + minutes * 60000);

  private minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000;
}
