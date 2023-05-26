import { IsString, MinLength } from 'class-validator';

export class Login {
  @IsString()
  @MinLength(5)
  id: string;

  @IsString()
  @MinLength(10)
  data: string;

  @IsString()
  user: string;
}
