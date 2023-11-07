import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataCollectionDocument } from 'src/schemas/dataCollection.schema';

@Injectable()
export class DataCollectionService {
    constructor(
        @InjectModel('DataCollection') 
        private readonly dataCollectionModel: Model<DataCollectionDocument>
    ) {}
    

    async findById(id: string): Promise<DataCollectionDocument>{

        const projection = {
            // _id: id,
        }

        return this.dataCollectionModel.findById(id).select(projection).exec()
    }

    async addGender(id: string, gender: string){
        const dataCollection = await this.dataCollectionModel.findById(id).exec();
        dataCollection.genders.push(gender);
        await dataCollection.save();
    }
    

}