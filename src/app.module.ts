import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { AdminChatModule } from './admin_chat/admin_chat.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: +configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USER') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || '4545',
        database: configService.get<string>('DB_NAME') || 'azizbek_project',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,

      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,

    }),

    AuthModule,

    ChatModule,

    AdminChatModule,

    UsersModule
  ],
  controllers: [AppController],
  providers: [AuthGuard,
    JwtService,
    AppService,
    ConfigService     
  ],
})
export class AppModule { }
