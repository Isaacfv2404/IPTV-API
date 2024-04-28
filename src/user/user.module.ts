import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';



@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [TypeOrmModule, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '2h' },
        };
      
      } 
    })
    //JwtModule.register({
    //  secret: process.env.JWT_SECRET,
    //  signOptions: { expiresIn: '2h' },
    //}),
  ],
  
})
export class UserModule { }
