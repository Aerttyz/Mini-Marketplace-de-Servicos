import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class CreateUserInput {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsEnum(Role)
    role: Role;

    @MinLength(8)
    @MaxLength(20)
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password too weak',
    })
    password: string;

    @MinLength(8)
    @MaxLength(20)
    @IsString()
    confirmPassword: string;

    @ValidateIf(o => o.role === Role.PROVIDER)
    @IsString()
    city?: string;

    @ValidateIf(o => o.role === Role.PROVIDER)
    @IsString()
    description?: string;
}