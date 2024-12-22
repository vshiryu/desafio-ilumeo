import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ type: 'float', nullable: true })
  totalHours: number;

  @Column({ default: 'regular' })
  type: string;

  @ManyToOne(() => User, (user) => user.shifts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

