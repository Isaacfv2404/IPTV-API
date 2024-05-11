import { IsNotEmpty, IsString } from "class-validator";


export class CreatePlaylistDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
 
}
