import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Review, ReviewSchema } from './review.schema';
import { PurchaseHistory, PurchaseHistorySchema } from './purchaseHistory.schema';
import { IncomingRequest, IncomingRequestSchema } from './incomingRequest.schema';
import { SentRequest, SentRequestSchema } from './sentRequest.schema';

@Schema()
export class User {

    @Prop()
    studentId: string;

    @Prop()
    password: string;

    @Prop()
    balance: number;

    @Prop()
    sellingStatus: boolean;

    @Prop()
    nickname: string;

    @Prop()
    faculty: string;

    @Prop()
    degree: number;

    @Prop()
    age: number;

    @Prop()
    gender: string;

    @Prop([PurchaseHistorySchema])
    purchaseHistories: PurchaseHistory[];

    @Prop( )
    previewPicture: string;

    @Prop()
    supplementPictures: string[];

    @Prop()
    price: number;

    @Prop()
    lineId: string;

    @Prop()
    sold: number;

    @Prop()
    description: string;

    @Prop([IncomingRequestSchema])
    incomingRequests: IncomingRequest[];

    @Prop([SentRequestSchema])
    sentRequests: SentRequest[];

    @Prop()
    averageScore: number;

    @Prop([ReviewSchema])
    reviews: Review[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
