import { IsNotEmpty, IsString, IsUUID} from "class-validator";

export class CreatePlaylistDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    userId: string;

}
