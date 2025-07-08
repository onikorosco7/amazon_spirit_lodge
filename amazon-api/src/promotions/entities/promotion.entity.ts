import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Promotion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column()
    description: string;

    @Column('float')
    discount: number;

    @Column({ default: true })
    active: boolean;

    @Column({ type: 'timestamp' })
    expiresAt: Date;
}
