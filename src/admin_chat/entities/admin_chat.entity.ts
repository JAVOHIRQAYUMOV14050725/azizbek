import { User } from 'src/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('admin_chats')
export class AdminChat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { array: true })
    content: string[];

    @Column({ default: false })
    isFavorite: boolean;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'adminId' })
    admin: User; // Admin bilan bog'lanish (faqat adminlar uchun)

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
