import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import {validate as isUUID} from 'uuid';

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

  async findOne(term: string) {
    let user: User;

    if(isUUID(term)){
      user = await this.userRepository.findOneBy({id:term});
    }else{
      const queryBuilder = this.userRepository.createQueryBuilder();//Se previene la inyección de SQL
      user = await queryBuilder.where('email = :email', {email: term.toLowerCase()}).getOne();
    }
    if (!user) throw new BadRequestException(`User with ${term} not found`);
    return user;
  }
/*
  async findUser(email: string, password: string): Promise<User | null> {
    let user: User;
    user = await this.userRepository.findOneBy({ email:email });
    if (!user) {
      return null; 
    }
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (isPasswordValid) {
      return user;
    }
    return null; 
  }
  
  async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
*/

async findUser(email: string, password: string): Promise<User | null> {
  let user: User;
  user = await this.userRepository.findOneBy({ email:email, password:password});
  if (!user) {
    throw new NotFoundException('Usuario no encontrado');  }
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
