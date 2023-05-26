import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), AuthModule],
})
export class AppModule {}
