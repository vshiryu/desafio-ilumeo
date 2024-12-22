import { Test, TestingModule } from '@nestjs/testing';
import { ShiftsService } from './shifts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { User } from '../users/entities/user.entity'; 
import { HttpException, HttpStatus } from '@nestjs/common';

const mockShiftRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('ShiftsService', () => {
  let service: ShiftsService;
  let shiftRepository: any;
  let userRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftsService,
        {
          provide: getRepositoryToken(Shift),
          useValue: mockShiftRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ShiftsService>(ShiftsService);
    shiftRepository = module.get(getRepositoryToken(Shift));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should create a new shift', async () => {
    const createShiftDto = { user_id: 1 };
    const mockShift = { id: 1, startTime: new Date(), user: { id: 1 }, type: 'regular' };

    userRepository.findOne.mockResolvedValue({ id: 1 });
    shiftRepository.findOne.mockResolvedValue(null);
    shiftRepository.create.mockReturnValue(mockShift);
    shiftRepository.save.mockResolvedValue(mockShift);

    const result = await service.create(createShiftDto);

    expect(shiftRepository.save).toHaveBeenCalledWith(mockShift);
    expect(result).toEqual(mockShift);
  });

  it('should throw error if user already has an ongoing shift', async () => {
    const createShiftDto = { user_id: 1 };
    const mockUser = { id: 1 };
    const mockOngoingShift = { id: 1, user: mockUser, endTime: null };

    userRepository.findOne.mockResolvedValue(mockUser);
    shiftRepository.findOne.mockResolvedValue(mockOngoingShift);

    try {
      await service.create(createShiftDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(e.getResponse()).toBe('User already has an ongoing shift');
    }
  });
});

