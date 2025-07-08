import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from 'src/bookings/entities/booking.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { ContactMessage } from 'src/contact/entities/contact.entity';
import { Conversation } from 'src/messages/entities/conversation.entity'; // ✅

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'client' })
    role: string;

    @Column({ nullable: true })
    avatar: string;

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    @OneToMany(() => ContactMessage, (message) => message.user)
    contactMessages: ContactMessage[];

    @OneToMany(() => Conversation, (conversation) => conversation.user)
    conversations: Conversation[];
}
