import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

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
    @IsOptional()
    isActive?: boolean;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsDate()
    @IsOptional()
    updatedAt?: Date;
}
