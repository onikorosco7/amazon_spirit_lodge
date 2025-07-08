import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
