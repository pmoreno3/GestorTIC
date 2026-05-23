import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import { AssignResourceDto } from './dto/assign-resource.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async create(@Body() createResourceDto: CreateResourceDto) {
    const resource = await this.resourcesService.create(createResourceDto);
    return {
      message: 'Resources created properly.',
      resource,
    };
  }

  @Get()
  findAll(@Query() query: FindResourcesQueryDto) {
    return this.resourcesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = +id;
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. Must be a number.');
    }
    return this.resourcesService.findOne(numericId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    const numericId = +id;
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. Must be a number.');
    }
    const resource = await this.resourcesService.update(
      numericId,
      updateResourceDto,
    );
    return {
      message: 'Resources modified properly.',
      resource,
    };
  }

  @Patch(':id/assign')
  async assign(
    @Param('id') id: string,
    @Body() assignResourceDto: AssignResourceDto,
  ) {
    const numericId = +id;
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. Must be a number.');
    }
    const resource = await this.resourcesService.assign(
      numericId,
      assignResourceDto,
    );
    return {
      message: 'Assignment was done properly',
      resource,
    };
  }

  @Patch(':id/release')
  async release(@Param('id') id: string) {
    const numericId = +id;
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. Must be a number.');
    }
    const resource = await this.resourcesService.release(numericId);
    return {
      message: 'Assignment was released properly',
      resource,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const numericId = +id;
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format. Must be a number.');
    }
    await this.resourcesService.remove(numericId);
    return {
      message: 'Resources deleted properly.',
    };
  }
}
