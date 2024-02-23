import { Template } from './entities/template.entity';
import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templatesRepository: Repository<Template>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createTemplateDto: CreateTemplateDto) {
    const attributes = createTemplateDto.attributes.map(
      (createAttributeDto) => new Attribute(createAttributeDto),
    );
    const template = new Template({
      ...createTemplateDto,
      documents: [],
      attributes,
    });
    await this.entityManager.save(template);
  }

  async findAll() {
    return this.templatesRepository.find();
  }

  async findOne(id: number) {
    return this.templatesRepository.findOne({
      where: { id },
      relations: { attributes: true },
    });
  }
}
