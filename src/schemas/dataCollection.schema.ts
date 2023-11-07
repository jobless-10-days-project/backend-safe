import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DataCollection {
    @Prop()
    genders: string[];
}

export type DataCollectionDocument = DataCollection & Document;

export const DataCollectionSchema = SchemaFactory.createForClass(DataCollection);
