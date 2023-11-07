import { Schema } from 'mongoose';

export const PurchaseHistorySchema = new Schema({

    userId: String,
    studentId: String,
    picture: String,
    nickname: String,
    price: Number,
    date: String
});

export interface PurchaseHistory {
    userId: string,
    studentId: string,
    picture: string,
    nickname: string,
    price: number,
    date: string
}