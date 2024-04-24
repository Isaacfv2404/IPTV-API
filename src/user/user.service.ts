import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
;
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}


  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    try{
      createUserDto.password = bcrypt.hashSync(createUserDto.password, saltOrRounds);
      const user = this.userRepository.create(createUserDto);//Guardo en memoria
      await this.userRepository.save(user);//Guardo en la base de datos

    }catch(error){
      console.log(error);
      this.handleDBExceptions(error);
    }

    return createUserDto;
  }

  findAll() {
    return this.userRepository.find();
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

    user.forEach(async (userI) => {;
    try{
      const user = this.userRepository.create(userI);//Guardo en memoria
      await this.userRepository.save(user);//Guardo en la base de datos

    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Error creating user');
    }
  });

    return user;
  }

  private handleDBExceptions(error:any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }else{
      this.handleDBExceptions(error);
    }
  }
}
