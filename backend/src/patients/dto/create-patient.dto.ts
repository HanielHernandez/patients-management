import { IsDateString, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePatientDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string

    
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName: string
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    email: string

    
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    phoneNumber: string

    @IsDateString()
    dob: string
}