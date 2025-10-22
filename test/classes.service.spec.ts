import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ClassesService } from '../src/classes/classes.service';
import { Class } from '../src/schemas/class.schema';

describe('ClassesService', () => {
  let service: ClassesService;
  let mockClassModel: any;

  beforeEach(async () => {
    mockClassModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: getModelToken(Class.name),
          useValue: mockClassModel,
        },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a class', async () => {
    const createClassDto = {
      title: 'Yoga Class',
      description: 'Beginner yoga',
      instructor: 'John Doe',
      startTime: '2024-01-01T10:00:00Z',
      endTime: '2024-01-01T11:00:00Z',
      capacity: 20,
      creditsRequired: 2,
    };

    const expectedClass = { ...createClassDto, _id: '123' };
    mockClassModel.create.mockResolvedValue(expectedClass);

    const result = await service.create(createClassDto);
    expect(result).toEqual(expectedClass);
  });
});
