import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

class CreateServiceVariationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(1)
    duration_minutes: number;
}

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    providerId: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUUID()
    categoryId: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    photos?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceVariationDto)
    variations: CreateServiceVariationDto[];
}