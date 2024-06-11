import { IsNumber, IsString} from "class-validator";

export class CreateChannelDto {

    @IsString()
    tvgId: string;
  
    @IsNumber()
    tvgNumber: number;
  
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

    @IsString()
    groupId: string;
}
