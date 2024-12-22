import { Test, TestingModule } from '@nestjs/testing';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';

const mockShiftsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  updateLastShiftEndTime: jest.fn(),
};

describe('ShiftsController', () => {
  let controller: ShiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftsController],
      providers: [
        {
          provide: ShiftsService,
          useValue: mockShiftsService,
        },
      ],
    }).compile();

    controller = module.get<ShiftsController>(ShiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new shift', async () => {
    const createShiftDto: CreateShiftDto = { user_id: 1 };
    const mockShift = {
      id: 1,
      startTime: new Date(),
      user: { id: 1 },
      type: 'regular',
    };

    mockShiftsService.create.mockResolvedValue(mockShift);

    const result = await controller.create(createShiftDto);

    expect(mockShiftsService.create).toHaveBeenCalledWith(createShiftDto);
    expect(result).toEqual(mockShift);
  });

  it('should return all shifts', async () => {
    const mockShifts = [
      { id: 1, startTime: new Date(), user: { id: 1 }, type: 'regular' },
      { id: 2, startTime: new Date(), user: { id: 2 }, type: 'regular' },
    ];

    mockShiftsService.findAll.mockResolvedValue(mockShifts);

    const result = await controller.findAll();

    expect(mockShiftsService.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockShifts);
  });

  it('should find a shift by id', async () => {
    const mockShift = { id: 1, startTime: new Date(), user: { id: 1 }, type: 'regular' };

    mockShiftsService.findOne.mockResolvedValue(mockShift);

    const result = await controller.findOne('1');

    expect(mockShiftsService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockShift);
  });

  it('should remove a shift', async () => {
    const mockShift = { id: 1 };

    mockShiftsService.remove.mockResolvedValue(mockShift);

    const result = await controller.remove('1');

    expect(mockShiftsService.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockShift);
  });
});
