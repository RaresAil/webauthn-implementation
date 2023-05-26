import { IsEmail, IsString } from 'class-validator';

export class Register {
  @IsEmail()
  email: string;

  @IsString()
  displayName: string;
}
