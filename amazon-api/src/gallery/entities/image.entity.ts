import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    imageUrl: string;

    @Column({ nullable: true })
    category: string;

    @CreateDateColumn()
    createdAt: Date;
}
