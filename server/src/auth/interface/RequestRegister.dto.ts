import { IsEmail, IsString, MinLength } from 'class-validator';

export class RequestRegister {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  displayName: string;
}
