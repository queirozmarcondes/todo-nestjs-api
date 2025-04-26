import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './log/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // torna as variáveis disponíveis em toda a app
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    TasksModule,
    UsersModule,
    AuthModule,
    LoggerModule,
  ],
})
export class AppModule {}
