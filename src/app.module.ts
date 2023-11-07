import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './files/file.module';
import { ConfigModule } from '@nestjs/config';
import { DataCollectionModule } from './dataCollections/dataCollection.module';

require('dotenv').config();

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    MongooseModule.forRoot(process.env.DB_CONNECTION_URI, {}),
    ConfigModule.forRoot({ isGlobal : true}),
    UserModule,
    AuthModule,
    FileModule,
    DataCollectionModule
  ],
})
export class AppModule {}