import { IsEmail, IsOptional } from 'class-validator';

export class RequestLogin {
  @IsEmail()
  @IsOptional()
  email?: string;
}
