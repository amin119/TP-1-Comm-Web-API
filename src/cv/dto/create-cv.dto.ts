import { IsString, IsInt } from 'class-validator';

export class CreateCvDto {
  @IsString()
  name: string;

  @IsString()
  firstname: string;

  @IsInt()
  age: number;

  @IsString()
  Cin: string;

  @IsString()
  Job: string;

  @IsString()
  path: string;
}
