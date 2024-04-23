import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }


  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    createUserDto.password = bcrypt.hashSync(createUserDto.password, saltOrRounds);
    await this.prisma.user.create({
      data: createUserDto,
    });
    return createUserDto;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async fillDB(user: User[]) {

    await this.prisma.user.createMany({ data: user });

    return user;
  }
}
