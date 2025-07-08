import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class BlogEntry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column({ type: 'text' })
    contenido: string;

    @CreateDateColumn()
    createdAt: Date;
}
