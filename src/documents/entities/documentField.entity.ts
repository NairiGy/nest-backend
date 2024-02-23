import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Document } from '../entities/document.entity';
import { Attribute } from '../../templates/entities/attribute.entity';

@Entity()
export class DocumentField extends AbstractEntity<DocumentField> {
  @ManyToOne(() => Document, (document) => document.fields, {
    onDelete: 'CASCADE',
  })
  document: Document;

  @ManyToOne(() => Attribute, (attribute) => attribute.fields, {
    onDelete: 'CASCADE',
  })
  attribute: Attribute;

  @Column()
  value: string;
}
