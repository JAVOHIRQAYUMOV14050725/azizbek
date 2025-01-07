    import { Chat } from 'src/chat/entities/chat.entity';
    import { User_Role } from 'src/enums/user.role.enum';
    import {
        Entity,
        PrimaryGeneratedColumn,
        Column,
        CreateDateColumn,
        UpdateDateColumn,
        OneToMany,
    } from 'typeorm';

    @Entity('users')
    export class User {
        @PrimaryGeneratedColumn()
        id: number;

        @Column({ type: 'varchar', length: 50, unique: true })
        username: string;

        @Column({ type: 'varchar', length: 2500 })
        password: string;

        @Column({ type: 'varchar', length: 2500 })
        email: string;

        @Column({ type: 'varchar', nullable: true })
        refreshToken?: string;

        @OneToMany(() => Chat, (chat) => chat.user)
        chats: Chat[]; 

        @Column({
            type: "enum",
            enum: User_Role,
        })
        role: User_Role;
        
        @CreateDateColumn()
        createdAt: Date;

        @UpdateDateColumn()
        updatedAt: Date;
    }
