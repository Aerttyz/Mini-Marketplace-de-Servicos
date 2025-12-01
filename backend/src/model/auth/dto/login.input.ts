import { IsString } from 'class-validator';

export default class AuthLoginInput {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
