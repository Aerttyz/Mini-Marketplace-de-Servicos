import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, Matches, Max, Min, ValidateNested } from 'class-validator';

export class AvailabilitySlotDto {
    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek: number;

    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Horário deve ser HH:mm (ex: 08:30)',
    })
    startTime: string;

    @IsString()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Horário deve ser HH:mm (ex: 18:00)',
    })
    endTime: string;
}

export class CreateAvailabilityDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AvailabilitySlotDto)
    slots: AvailabilitySlotDto[];
}