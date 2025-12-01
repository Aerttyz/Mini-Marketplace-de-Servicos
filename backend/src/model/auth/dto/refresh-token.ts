import { IsString } from "class-validator";

export default class AuthRefreshTokenInput {
    @IsString()
    refresh_token: string;
}
