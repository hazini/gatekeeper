import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateLicenseDto {
  @IsString()
  @IsNotEmpty()
  domain: string;

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
  domain?: string;

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
  domain: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
