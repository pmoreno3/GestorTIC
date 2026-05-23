import { IsNotEmpty, IsString } from 'class-validator';

export class ParseResourceAssignmentDto {
  @IsString()
  @IsNotEmpty()
  command: string;
}
