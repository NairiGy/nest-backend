import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Attribute } from './attribute.entity';
import { Document } from '../../documents/entities/document.entity';

@Entity()
export class Template extends AbstractEntity<Template> {
  @Column()
  name: string;

  @OneToMany(() => Attribute, (attribute) => attribute.template, {
    cascade: true,
  })
  attributes: Attribute[];

  @OneToMany(() => Document, (document) => document.template)
  documents: Document[];
}
