import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignResourceDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId: number;
}
