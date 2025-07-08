import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Hero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}