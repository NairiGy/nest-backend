import { Template } from './../templates/entities/template.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentDto, Entry } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { DocumentField } from './entities/documentField.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
    @InjectRepository(Template)
    private readonly templatesRepository: Repository<Template>,
    private readonly entityManager: EntityManager,
  ) {}

  validateEntiries(entries: Entry[], template: Template) {
    const errors = [];
    const validatedFields = template.attributes.map((attribute) => {
      const field = entries.find((f) => f.name === attribute.name);
      if (!field) {
        errors.push(`Field ${attribute.name} is required`);
        return;
      }

      if (attribute.type === 'date') {
        if (isNaN(Date.parse(field.value))) {
          errors.push(`Field ${attribute.name} should be date`);
        }
      } else if (typeof field.value !== attribute.type) {
        errors.push(
          `Field ${attribute.name} should be of type ${attribute.type}`,
        );
      }

      return {
        name: field.name,
        type: attribute.type,
        attribute,
        value: field.value,
      };
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return validatedFields;
  }

  async create(createDocumentDto: CreateDocumentDto) {
    const { templateId, fields } = createDocumentDto;
    const template = await this.templatesRepository.findOne({
      where: { id: templateId },
      relations: ['attributes'],
    });
    if (!template) {
      throw new BadRequestException(`No template found with id ${templateId}`);
    }
    const validatedFields = this.validateEntiries(fields, template);

    const document = new Document({
      ...createDocumentDto,
      template: template,
      fields: validatedFields.map(
        (createFieldDto) => new DocumentField(createFieldDto),
      ),
    });
    await this.entityManager.save(document);
  }

  async findAll() {
    return this.documentsRepository.find();
  }

  async findOne(id: number) {
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: ['fields', 'fields.attribute'],
    });

    if (!document) {
      throw new BadRequestException(`No document found with id ${id}`);
    }
    const formatValue = (field) => {
      if (field.attribute.type === 'number') {
        return Number(field.value);
      }
      return field.value;
    };
    const documentFields = document.fields.map((field) => {
      return {
        name: field.attribute.name,
        value: formatValue(field),
      };
    });

    return {
      ...document,
      fields: documentFields,
    };
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    // await this.entityManager.transaction(async (entityManager) => {
    //   const document = await this.documentsRepository.findOne({
    //     where: { id },
    //     relations: ['template'],
    //   });

    //   if (!document) {
    //     throw new BadRequestException(`No document found with id ${id}`);
    //   }

    //   this.validateEntiries(updateDocumentDto.fields, template);

    //   const fields = updateDocumentDto.fields.map(
    //     (createFieldDto) => new DocumentField(createFieldDto),
    //   );
    // });
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: ['template', 'fields', 'fields.attribute'],
    });

    if (!document) {
      throw new BadRequestException(`No document found with id ${id}`);
    }

    const template = await this.templatesRepository.findOne({
      where: { id: document.template.id },
      relations: ['attributes'],
    });
    console.log(template);
    console.log(updateDocumentDto);
    const validatedFields = this.validateEntiries(
      updateDocumentDto.fields,
      template,
    );
    // const fields = updateDocumentDto.fields.map(
    //   (createFieldDto) => new DocumentField(createFieldDto),
    // );
    // document.fields = fields;
    document.name = updateDocumentDto.name;
    delete document.template;
    await this.entityManager.save(
      new Document({
        ...document,
        fields: validatedFields.map(
          (createFieldDto) => new DocumentField(createFieldDto),
        ),
      }),
    );
  }

  async remove(id: number) {
    return this.documentsRepository.delete(id);
  }
}
