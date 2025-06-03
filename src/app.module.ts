import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { LogsModule } from './logs/logs.module';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <-- FIRST!
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    AuthModule,
    TasksModule,
    UsersModule,
    LogsModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.on('connecting', () => {
      this.logger.log('MongoDB connection is in progress...');
    });
    this.connection.on('connected', () => {
      this.logger.log('MongoDB connected successfully');
    });
    this.connection.once('open', () => {
      this.logger.log('MongoDB connection is open and ready!');
    });
    this.connection.on('error', (error: Error) => {
      this.logger.error('MongoDB connection error:', error.message);
    });
  }
}
