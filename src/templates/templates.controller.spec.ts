import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Template } from './entities/template.entity';

describe('TemplatesController', () => {
  let controller: TemplatesController;
  let templateService: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [
        {
          provide: TemplatesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Template),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TemplatesController>(TemplatesController);
    templateService = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all templates', async () => {
    const templates = [
      new Template({ id: 1, name: 'template1' }),
      new Template({ id: 2, name: 'template2' }),
    ];
    jest
      .spyOn(templateService, 'findAll')
      .mockImplementation(() => Promise.resolve(templates));
    expect(await controller.findAll()).toEqual(templates);
  });

  it('should return template by id', async () => {
    const template = new Template({ id: 1, name: 'template1' });
    jest
      .spyOn(templateService, 'findOne')
      .mockImplementation(() => Promise.resolve(template));
    expect(await controller.findOne('1')).toEqual(template);
  });
});
