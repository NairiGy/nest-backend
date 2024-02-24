import { Template } from './../templates/entities/template.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { DocumentField } from './entities/documentField.entity';
import { CreateDocumentFieldDto } from './dto/create-documentField.dto';

function isDate(value: string) {
  return !isNaN(Date.parse(value));
}

function formatValue(field: DocumentField) {
  if (field.attribute.type === 'number') {
    return Number(field.value);
  }
  return field.value;
}

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
    @InjectRepository(Template)
    private readonly templatesRepository: Repository<Template>,
    private readonly entityManager: EntityManager,
  ) {}

  private validateDocumentFieldDto(
    template: Template,
    createDocumentFieldDto: CreateDocumentFieldDto,
  ) {
    const errors = [];
    const attribute = template.attributes.find(
      (attribute) => attribute.name === createDocumentFieldDto.name,
    );

    if (!attribute) {
      errors.push(`No field found with name ${createDocumentFieldDto.name}`);
    }

    if (attribute.type === 'date' && !isDate(createDocumentFieldDto.value)) {
      errors.push(`Field ${attribute.name} should be date`);
    } else if (typeof createDocumentFieldDto.value !== attribute.type) {
      errors.push(
        `Field ${attribute.name} should be of type ${attribute.type}`,
      );
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
  private updateDocumentField(
    document: Document,
    updateDocumentFieldtDto: CreateDocumentFieldDto,
  ) {
    this.validateDocumentFieldDto(document.template, updateDocumentFieldtDto);

    const documentField = document.fields.find(
      (field) => field.attribute.name === updateDocumentFieldtDto.name,
    );
    const documentFieldIdToUpdate = document.fields.indexOf(documentField);

    document.fields[documentFieldIdToUpdate] = new DocumentField({
      ...documentField,
      value: updateDocumentFieldtDto.value,
    });

    return new Document(document);
  }

  async create(createDocumentDto: CreateDocumentDto) {
    const { templateId } = createDocumentDto;
    const template = await this.templatesRepository.findOne({
      where: { id: templateId },
      relations: ['attributes'],
    });
    if (!template) {
      throw new BadRequestException(`No template found with id ${templateId}`);
    }

    createDocumentDto.fields.forEach((createDocumentFieldDto) => {
      this.validateDocumentFieldDto(template, createDocumentFieldDto);
    });

    const documentFields = createDocumentDto.fields.map(
      (createDocumentFieldDto) =>
        new DocumentField({
          ...createDocumentFieldDto,
          attribute: template.attributes.find(
            (attribute) => attribute.name === createDocumentFieldDto.name,
          ),
        }),
    );
    console.log(documentFields);

    const document = new Document({
      ...createDocumentDto,
      template: template,
      fields: documentFields,
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
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: [
        'template',
        'template.attributes',
        'fields',
        'fields.attribute',
      ],
    });

    if (!document) {
      throw new BadRequestException(`No document found with id ${id}`);
    }
    let updatedDocument: Document = document;

    updateDocumentDto.fields.forEach((field) => {
      updatedDocument = this.updateDocumentField(updatedDocument, field);
    });
    updatedDocument.name = updateDocumentDto.name;

    await this.entityManager.save(updatedDocument);
  }

  async remove(id: number) {
    return this.documentsRepository.delete(id);
  }
}
