/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { hashPassword } from 'src/common/helpers/crypto';
import { CreateUserInput } from './dto/create-user-input';
import { UpdateUserDto } from './dto/update-user-input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateUserInput): Promise<User> {
    const findUser = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (findUser) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    if (data.password !== data.confirmPassword)
      throw new BadRequestException('As senhas não coincidem');

    const hashedPassword = hashPassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: data.role,

        provider: data.role === 'PROVIDER' ? {
          create: {
            city: data.city,
            description: data.description,
          }
        } : undefined,
      },
    });

    return user;
  }

  async update(id: string, { ...data }: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { provider: true },
    });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const { city, description, ...userData } = data;

    const updateData: any = {
      ...userData,
    };

    if (user.provider && (city || description)) {
      updateData.provider = {
        update: {
          city: city,
          description: description
        }
      };
    } else if (!user.provider && (city || description)) {
      throw new BadRequestException('Usuário não é um prestador de serviços');
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { provider: true },
    });
  }
}
