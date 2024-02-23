import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Template } from '../../templates/entities/template.entity';
import { DocumentField } from './documentField.entity';

@Entity()
export class Document extends AbstractEntity<Document> {
  @Column()
  name: string;

  @ManyToOne(() => Template, (template) => template.documents)
  template: Template;

  @OneToMany(() => DocumentField, (documentField) => documentField.document, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  fields: DocumentField[];
}
