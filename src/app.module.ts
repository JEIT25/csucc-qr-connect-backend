/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MasterlistModule } from './masterlist/masterlist.module';
import { AttendeeRecordModule } from './attendee-record/attendee-record.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env vars available everywhere
    }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'postgres', // DB type
      host: config.get('DB_HOST'), // localhost (from .env)
      port: +config.get<number>('DB_PORT'), // converts to number
      username: config.get('DB_USERNAME'), // postgres
      password: config.get('DB_PASSWORD'), // admin
      database: config.get('DB_NAME'), // csucc-qrconnect
      autoLoadEntities: true, // automatically load entities
      synchronize: true, // sync schema with DB (danger in prod!)
    }),
  }),

    AuthModule,
    MasterlistModule,
    AttendeeRecordModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
