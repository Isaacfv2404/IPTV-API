import { IsString, IsUUID } from "class-validator";

export class CreateGroupDto {

    @IsString()
    name: string;

    @IsString()
    @IsUUID()
    playlistId: string;
}
