import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { License } from './license.entity';
import { CreateLicenseDto, UpdateLicenseDto } from './license.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FindAllParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string>;
}

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
  ) {}

  async findAll(params: FindAllParams = {}): Promise<PaginatedResult<License>> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'id',
      sortOrder = 'desc',
      filters = {},
    } = params;

    // Create where clause for filtering
    const where: FindOptionsWhere<License> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'status') {
          // Handle boolean status filter
          where[key] = value === 'true';
        } else {
          where[key] = Like(`%${value}%`);
        }
      }
    });

    // Map frontend column names to database column names
    const columnMap: Record<string, string> = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };

    const orderBy = columnMap[sortBy] || sortBy;

    const [data, total] = await this.licenseRepository.findAndCount({
      where,
      order: { [orderBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number): Promise<License> {
    const license = await this.licenseRepository.findOne({ where: { id } });
    if (!license) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }
    return license;
  }

  async create(createLicenseDto: CreateLicenseDto): Promise<License> {
    const license = this.licenseRepository.create({
      ...createLicenseDto,
      status: createLicenseDto.status ?? true, // Default to true if not provided
    });
    return this.licenseRepository.save(license);
  }

  async update(id: number, updateLicenseDto: UpdateLicenseDto): Promise<License> {
    const license = await this.findOne(id);
    Object.assign(license, updateLicenseDto);
    return this.licenseRepository.save(license);
  }

  async remove(id: number): Promise<void> {
    const license = await this.findOne(id);
    await this.licenseRepository.remove(license);
  }

  private matchDomain(licenseDomain: string, requestDomain: string): boolean {
    // Special case for localhost
    if (requestDomain === 'localhost' && licenseDomain === 'localhost') {
      return true;
    }

    // Handle wildcard domains
    if (licenseDomain.startsWith('*.')) {
      const baseDomain = licenseDomain.slice(2); // Remove *. prefix
      return requestDomain === baseDomain || requestDomain.endsWith('.' + baseDomain);
    }

    // Exact match
    return licenseDomain === requestDomain;
  }

  async verifyLicense(domain: string, token: string): Promise<boolean> {
    // Get all active licenses
    const licenses = await this.licenseRepository.find({
      where: { status: true },
    });

    // Check each license for a matching domain and token
    const matchingLicense = licenses.find(license => 
      this.matchDomain(license.domain, domain) && license.token === token
    );

    return !!matchingLicense;
  }
}
