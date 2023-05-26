import { IsString, MinLength } from 'class-validator';

export class AbortRegister {
  @IsString()
  @MinLength(2)
  challenge: string;
}
