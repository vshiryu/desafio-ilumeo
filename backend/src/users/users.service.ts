import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const emailAlreadyExists = await this.userRepository.findOneBy({email: createUserDto.email})
    
    if (emailAlreadyExists) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    const user = this.userRepository.create({ ...createUserDto, password: hashedPassword });
    const savedUser = await this.userRepository.save(user);
    const { password, ...rest } = savedUser;
    return rest;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...rest }) => rest);
  }

  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    const { password, ...rest } = user;
    return rest;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
  
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    const { password, ...rest } = updatedUser;
    return rest;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
