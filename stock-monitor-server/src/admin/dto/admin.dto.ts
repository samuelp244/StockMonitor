import { IsNotEmpty, IsString } from 'class-validator';

export class disableUserDto {
  @IsString()
  @IsNotEmpty()
  userToDisable: string;
}

export class enableUserDto {
  @IsString()
  @IsNotEmpty()
  userToEnable: string;
}
