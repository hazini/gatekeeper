import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { License } from './license.entity';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { PublicLicenseController } from './public-license.controller';

@Module({
  imports: [TypeOrmModule.forFeature([License])],
  providers: [LicenseService],
  controllers: [LicenseController, PublicLicenseController],
  exports: [LicenseService],
})
export class LicenseModule {}
