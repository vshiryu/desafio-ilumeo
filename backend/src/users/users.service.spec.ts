import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@domain.com',
      password: 'password123',
      is_active: true
    };

    const mockUser = {
      ...createUserDto,
      id: 1,
    };

    mockUserRepository.create.mockReturnValue(mockUser);
    mockUserRepository.save.mockResolvedValue(mockUser);

    await service.create(createUserDto);

    expect(mockUserRepository.create).toHaveBeenCalled();

    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('should find all users', async () => {
    const mockUsers = [
      { id: 1, name: 'User One', email: 'userone@domain.com' },
      { id: 2, name: 'User Two', email: 'usertwo@domain.com' },
    ];

    mockUserRepository.find.mockResolvedValue(mockUsers);

    const result = await service.findAll();
    
    expect(result).toEqual(mockUsers);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  it('should find a user by ID', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@domain.com' };

    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.findOne(1);

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a user', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@domain.com' };
    const updatedUser = { id: 1, name: 'Updated User', email: 'updated@domain.com' };

    mockUserRepository.update.mockResolvedValue(null);
    mockUserRepository.findOne.mockResolvedValue(updatedUser);

    const result = await service.update(1, { name: 'Updated User', email: 'updated@domain.com' });

    expect(result).toEqual(updatedUser);
    expect(mockUserRepository.update).toHaveBeenCalledWith(1, { name: 'Updated User', email: 'updated@domain.com' });  
  });

  it('should delete a user', async () => {
    const mockDeleteResult = { affected: 1 };
    mockUserRepository.delete.mockResolvedValue(mockDeleteResult);

    const result = await service.remove(1);

    expect(result).toBeUndefined(); 
    expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
  });
});
