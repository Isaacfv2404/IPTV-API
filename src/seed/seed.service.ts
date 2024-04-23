import { Injectable } from '@nestjs/common';
import { USER_SEED } from './data/user.seed';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SeedService {
    constructor(private userService:UserService){}

    populateDB(){
       
        this.userService.fillDB(USER_SEED);
        return "DB populated";
    }
}
