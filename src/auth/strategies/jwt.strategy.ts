import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import {  UnauthorizedException } from "@nestjs/common";

import { Request } from "express";


export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ){
        super({secretOrKey: configService.get('JWT_SECRET'),
               jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(req: Request ,payload: any): Promise<User>{
        
        const {id} = payload;
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        console.log(refreshToken);
      
        const user = await this.userRepository.findOneBy({id});

        
        if(!user) throw new UnauthorizedException('Token invalido');
        if(!user.isActive) throw new UnauthorizedException('El usuario no está activo');


        return user;
    }
}