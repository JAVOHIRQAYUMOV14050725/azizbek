import { Module } from '@nestjs/common';
import { AdminChatService } from './admin_chat.service';
import { AdminChatController } from './admin_chat.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminChat } from './entities/admin_chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminChat, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  controllers: [AdminChatController],
  providers: [AdminChatService],
})
export class AdminChatModule {}
