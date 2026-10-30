import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientsDto } from './dto/query-patients.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPatientsDto) {
    const { page, limit, search, sortBy, order } = query;

    const where: Prisma.PatientWhereInput = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async create(dto: CreatePatientDto) {
    const existing = await this.prisma.patient.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('A patient with this email already exists');
    }

    return this.prisma.patient.create({
      data: {
        ...dto,
        dob: new Date(dto.dob),
      },
    });
  }

  async update(id: string, dto: UpdatePatientDto) {
    await this.findOne(id);

    if (dto.email) {
      const existing = await this.prisma.patient.findUnique({
        where: { email: dto.email },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'A patient with this email already exists',
        );
      }
    }

    return this.prisma.patient.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.dob ? { dob: new Date(dto.dob) } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.patient.delete({
      where: { id },
    });

    return { message: 'Patient deleted successfully' };
  }
}