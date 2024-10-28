import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { LicenseService, FindAllParams } from './license.service';
import { CreateLicenseDto, UpdateLicenseDto, VerifyLicenseDto } from './license.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('licenses')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const params: FindAllParams = {
      page: page ? +page : undefined,
      pageSize: pageSize ? +pageSize : undefined,
      sortBy,
      sortOrder,
      filters: filters ? JSON.parse(filters) : undefined,
    };
    return this.licenseService.findAll(params);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licenseService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createLicenseDto: CreateLicenseDto) {
    return this.licenseService.create(createLicenseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateLicenseDto: UpdateLicenseDto) {
    return this.licenseService.update(+id, updateLicenseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licenseService.remove(+id);
  }

  @Post('check-license')
  async verifyLicense(@Body() verifyLicenseDto: VerifyLicenseDto) {
    const isValid = await this.licenseService.verifyLicense(
      verifyLicenseDto.url,
      verifyLicenseDto.token,
    );
    return { valid: isValid };
  }
}
