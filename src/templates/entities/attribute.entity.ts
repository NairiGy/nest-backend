import { DocumentField } from './../../documents/entities/documentField.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Template } from './template.entity';

export enum AttributeType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
}
@Entity()
export class Attribute extends AbstractEntity<Attribute> {
  @Column()
  name: string;

  @ManyToOne(() => Template, (template) => template.attributes, {
    onDelete: 'CASCADE',
  })
  template: Template;

  @OneToMany(() => DocumentField, (documentField) => documentField.attribute)
  fields: DocumentField[];

  @Column({
    type: 'enum',
    enum: AttributeType,
    default: AttributeType.STRING,
  })
  type: AttributeType;
}
