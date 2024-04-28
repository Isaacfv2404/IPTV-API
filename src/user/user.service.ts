import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { LoginUserDto,CreateUserDto,UpdateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }


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
        token: this.getJwtToken({email: user.email})
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
    if (!user) throw new BadRequestException(`User with ${term} not found`);
    return user;
  }


  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    try {
      await this.userRepository.save(user);
      return user;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }


  async remove(id: string) {
    
    const product = await this.findOne(id);
    await this.userRepository.remove(product);
  }


  async login(loginUserDto: LoginUserDto) {
    const {email,password} =  loginUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email
      },
      select: {email: true, password: true}
    });

    if (!user) throw new UnauthorizedException('Invalid credentials (email)');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Invalid credentials (password)');

    return {...user,
      token: this.getJwtToken({email: user.email})
    };
    //TODO: Retornar el JWT de acceso

  }

  private getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);

    return token;
  }

  private handleDBExceptions(error: any): never {
    
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error ocurred, check server logs");

  }
}
