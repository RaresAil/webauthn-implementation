import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { SessionsDefinition } from '@schemas/Sessions.schema';
import { KeysDefinition } from '@schemas/Keys.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [MongooseModule.forFeature([KeysDefinition, SessionsDefinition])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
