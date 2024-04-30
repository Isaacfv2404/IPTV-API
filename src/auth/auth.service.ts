import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, LoginUserDto} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

import {decode} from 'jsonwebtoken';


@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      return {...user,
        token: this.getJwtToken({id: user.id})
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  findAll(PaginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = PaginationDto;
    return this.userRepository.find({
      take: limit,
      skip: offset
    });
  }


    async findOne(term: string) {
   
    let user: User;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder();//Se previene la inyección de SQL
      user = await queryBuilder.where('email = :email', { email: term.toLowerCase() }).getOne();
    }
    if (!user) throw new BadRequestException(`Usuario con ${term} no encontrado`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto
    });

    user.updatedAt = new Date();

    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);

    try {
      await this.userRepository.save(user);
      return user;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  private getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);
    
    

    return token;
  }

  async login(loginUserDto: LoginUserDto) {
    const {email,password} =  loginUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email
      },
      select: {email: true, password: true, id: true}
    });

    if (!user) throw new UnauthorizedException('El email es inválido');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('La contraseña es inválida');


    
    return {id: user.id ,email: user.email,
      token: this.getJwtToken({id: user.id})
    };
    //TODO: Retornar el JWT de acceso

  }




  private handleDBExceptions(error: any): never {
    
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException("Error inesperado, Revisa los logs del servidor");

  }
}
