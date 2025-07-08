import { Column, Decimal128, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    // Identificador único de la habitación (clave primaria, autogenerada
    id: number

    // Nombre de la habitación (puede ser número, nombre o código)
    @Column()
    name: string

    // Tipo de habitación: simple, doble, suite, etc.
    @Column()
    type: string

    // Precio de la habitación, con hasta 10 dígitos y 2 decimales
    @Column('decimal', {
        precision: 10, scale: 2, transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    price: number;

    // Descripción breve de la habitación
    @Column()
    description: string

    // Indica si la habitación está disponible (por defecto es true)
    @Column({ default: true })
    avaible: boolean

    // URL o nombre del archivo de imagen de la habitación (opcional)
    @Column({ nullable: true })
    image: string
}