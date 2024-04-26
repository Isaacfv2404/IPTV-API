import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class UserService {

  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}


  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    createUserDto.password = bcrypt.hashSync(createUserDto.password, saltOrRounds);
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  findAll(PaginationDto: PaginationDto) {
    const {limit=10, offset=0} = PaginationDto;
    return this.userRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException(`User with id ${id} not found`);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.userRepository.remove(product);
  }

  fillDB(user: User[]) {


    user.forEach(element => {
      this.userRepository.save(element);
    });


    return user;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error ocurred, check server logs");

  }
}
