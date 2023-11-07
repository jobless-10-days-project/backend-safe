import { Module } from '@nestjs/common';
import { DataCollectionController } from './dataCollection.controller';
import { DataCollectionService } from './dataCollection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DataCollectionSchema } from 'src/schemas/dataCollection.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'DataCollection', schema: DataCollectionSchema }])
    ],
    controllers: [DataCollectionController],
    //exports: [DataCollectionService],
    providers: [DataCollectionService],
})

export class DataCollectionModule {}