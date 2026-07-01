import { IsString, MaxLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @MaxLength(120)
  restaurantName!: string;

  @IsString()
  @MaxLength(10)
  currency!: string;

  @IsString()
  @MaxLength(10)
  taxRate!: string;
}
