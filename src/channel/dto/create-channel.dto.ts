import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateChannelDto {

    @IsString()
    tvgId: string;
  
    @IsNumber()
    tvgNumber: number;
  
    @IsString()
    @MinLength(3)
    tvgName: string;
  
    @IsString()
    tvgLogo: string;
  
    @IsString()
    tvgGroup: string;
  

    @IsString()
    tvgDetail: string;

    @IsString()
    tvgUrl: string;

    @IsString()
    playlistId: string;
}
