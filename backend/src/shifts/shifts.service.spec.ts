import { Test, TestingModule } from '@nestjs/testing';
import { ShiftsService } from './shifts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockShiftRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

describe('ShiftsService', () => {
  let service: ShiftsService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftsService,
        {
          provide: getRepositoryToken(Shift),
          useValue: mockShiftRepository,
        },
      ],
    }).compile();

    service = module.get<ShiftsService>(ShiftsService);
    repository = module.get(getRepositoryToken(Shift));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new shift', async () => {
    const createShiftDto = { user_id: 1 };
    const mockShift = {
      id: 1,
      startTime: new Date(),
      user: { id: 1 },
      type: 'regular',
    };

    repository.findOne.mockResolvedValue(null);
    repository.create.mockReturnValue(mockShift); 
    repository.save.mockResolvedValue(mockShift);

    const result = await service.create(createShiftDto);

    expect(repository.save).toHaveBeenCalledWith(mockShift);
    expect(result).toEqual(mockShift);
  });

  it('should throw error if user already has an ongoing shift', async () => {
    const createShiftDto = { user_id: 1 };
    const mockOngoingShift = { id: 1, user: { id: 1 }, endTime: null };

    repository.findOne.mockResolvedValue(mockOngoingShift);

    try {
      await service.create(createShiftDto);
    } catch (e) {
      expect(e instanceof HttpException).toBe(true);
      expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(e.getResponse()).toBe('User already has an ongoing shift');
    }
  });
});
