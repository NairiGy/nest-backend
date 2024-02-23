import { CreateAttributeDto } from './dto/create-attribute.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import { AttributeType } from './entities/attribute.entity';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let templatesRepository: Repository<Template>;
  let entityManager: EntityManager;
  let createTemplateDto: CreateTemplateDto;
  let createAttributeDto: CreateAttributeDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getRepositoryToken(Template),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
    templatesRepository = module.get<Repository<Template>>(
      getRepositoryToken(Template),
    );
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('create', async () => {
    createTemplateDto = new CreateTemplateDto();
    createAttributeDto = new CreateAttributeDto();
    createAttributeDto.name = 'Test attribute';
    createAttributeDto.type = AttributeType.STRING;
    createTemplateDto.name = 'Test template';
    createTemplateDto.attributes = [createAttributeDto];
    await service.create(createTemplateDto);
    expect(entityManager.save).toHaveBeenCalled();
  });

  test('findAll', async () => {
    await service.findAll();
    expect(templatesRepository.find).toHaveBeenCalled();
  });

  test('findOne', async () => {
    await service.findOne(1);
    expect(templatesRepository.findOne).toHaveBeenCalled();
  });
});
