import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateLicenseDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean = true;
}

export class UpdateLicenseDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  token?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

export class VerifyLicenseDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
