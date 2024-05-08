import { IsNumber, IsString } from "class-validator";
import { User } from "src/auth/entities/user.entity";

export class CreatePlaylistDto {
    
    @IsString()
    tvgId: string;

    @IsNumber()
    tvgNumber: number

    @IsString()
    tvgName: string;

    @IsString()
    tvgLogo: string;

    @IsString()
    tvgGroup: string;

    @IsString()
    tvgUrl: string;

 
}
