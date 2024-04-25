import { IsBoolean, IsDate, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    email: string;


    @IsString()
  
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsBoolean()
    isActive: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}
