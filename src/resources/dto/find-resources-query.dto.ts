import { IsOptional, IsEnum } from 'class-validator';
import { ResourceType, ResourceStatus } from '../enums/resource.enums';

export class FindResourcesQueryDto {
  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;

  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;
}
