import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll(query: FindUsersQueryDto): Promise<User[]> {
    const { role, active } = query;
    return await this.userRepository.find({
      where: {
        ...(role && { role }),
        ...(active !== undefined && { active }),
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async parseResourceAssignment(command: string): Promise<{ userId: number; resourceId: number }> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('OpenAI API key is missing in environment variables.');
    }

    const openai = new OpenAI({ apiKey });

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that parses resource assignment commands. ' +
              'Extract the userId and resourceId from the command. ' +
              'Respond ONLY with a JSON object like {"userId": number, "resourceId": number}. ' +
              'If you cannot find both IDs, respond with {"error": "not_found"}.',
          },
          {
            role: 'user',
            content: command,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new BadRequestException('OpenAI returned an empty response.');
      }
      const result = JSON.parse(content);

      if (result.error || !result.userId || !result.resourceId) {
        throw new BadRequestException('Could not parse userId and resourceId from the command.');
      }

      return {
        userId: Number(result.userId),
        resourceId: Number(result.resourceId),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`OpenAI parsing failed: ${error.message}`);
    }
  }
}
