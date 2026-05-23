import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import { AssignResourceDto } from './dto/assign-resource.dto';
import { Resource } from './entities/resource.entity';
import { ResourceStatus } from './enums/resource.enums';
import { UsersService } from '../users/users.service';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly usersService: UsersService,
  ) {}

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const newResource = this.resourceRepository.create(createResourceDto);
    return await this.resourceRepository.save(newResource);
  }

  async findAll(query: FindResourcesQueryDto): Promise<Resource[]> {
    const { status, type } = query;
    return await this.resourceRepository.find({
      where: {
        ...(status && { status }),
        ...(type && { type }),
      },
    });
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return resource;
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.findOne(id);
    const updatedResource = Object.assign(resource, updateResourceDto);
    return await this.resourceRepository.save(updatedResource);
  }

  async assign(
    id: number,
    assignResourceDto: AssignResourceDto,
  ): Promise<Resource> {
    const resource = await this.findOne(id);
    // Verify user exists
    await this.usersService.findOne(assignResourceDto.userId);

    resource.status = ResourceStatus.ASSIGNED;
    resource.assignedToUserId = assignResourceDto.userId;

    return await this.resourceRepository.save(resource);
  }

  async release(id: number): Promise<Resource> {
    const resource = await this.findOne(id);

    resource.status = ResourceStatus.AVAILABLE;
    resource.assignedToUserId = null;

    return await this.resourceRepository.save(resource);
  }

  async remove(id: number): Promise<void> {
    const resource = await this.findOne(id);
    await this.resourceRepository.remove(resource);
  }
}
