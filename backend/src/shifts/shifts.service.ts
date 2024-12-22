import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { IsNull } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepository: Repository<Shift>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createShiftDto: CreateShiftDto) {
    const userId = createShiftDto.user_id;

    const userExists = await this.userRepository.findOne({ where: { id: userId } });
    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const ongoingShift = await this.shiftRepository.findOne({
      where: {
        user: { id: userId },
        endTime: IsNull(),
      },
    });

    if (ongoingShift) {
      throw new HttpException('User already has an ongoing shift', HttpStatus.BAD_REQUEST);
    }

    const shift = this.shiftRepository.create({
      startTime: new Date(),
      user: { id: userId },
      ...createShiftDto, 
    });

    return this.shiftRepository.save(shift);
  }

  findAll() {
    return this.shiftRepository.find();
  }

  findOne(id: number) {
    return this.shiftRepository.findOneBy({id});
  }

  remove(id: number) {
    return `This action removes a #${id} shift`;
  }

  async updateLastShiftEndTime(userId: number): Promise<Shift> {
    const lastShift = await this.shiftRepository.findOne({
      where: {
        user: { id: userId },
        endTime: IsNull(), 
      },
      order: { startTime: 'DESC' },
    });

    if (!lastShift) {
      throw new HttpException("No ongoing shift found for this user", HttpStatus.BAD_REQUEST)
    }

    lastShift.endTime = new Date();
    
    lastShift.totalHours = Math.abs((lastShift.endTime.getTime() - lastShift.startTime.getTime()) / 3600000);

    return this.shiftRepository.save(lastShift);
  }

  async findAllByUser(userId: number) {
    const shifts = await this.shiftRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        startTime: 'DESC',
      },
    });

    return shifts;
  }
  
}
