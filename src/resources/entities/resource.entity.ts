import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ResourceType, ResourceStatus } from '../enums/resource.enums';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'simple-enum',
    enum: ResourceType,
  })
  type: ResourceType;

  @Column({
    type: 'simple-enum',
    enum: ResourceStatus,
    default: ResourceStatus.AVAILABLE,
  })
  status: ResourceStatus;

  @Column({ nullable: true })
  image: string;

  @Column()
  location: string;

  @Column({ type: 'int', nullable: true })
  assignedToUserId: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
