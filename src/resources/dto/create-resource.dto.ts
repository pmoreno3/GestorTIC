import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ResourceType, ResourceStatus } from '../enums/resource.enums';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ResourceType, { message: "Selected type doesn't exist." })
  type: ResourceType;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;
}
