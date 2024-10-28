import { Controller, Post, Body } from '@nestjs/common';
import { LicenseService } from './license.service';
import { VerifyLicenseDto } from './license.dto';

@Controller('public/licenses')
export class PublicLicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Post('check-license')
  async verifyLicense(@Body() verifyLicenseDto: VerifyLicenseDto) {
    const isValid = await this.licenseService.verifyLicense(
      verifyLicenseDto.domain,
      verifyLicenseDto.token,
    );
    return { valid: isValid };
  }
}
