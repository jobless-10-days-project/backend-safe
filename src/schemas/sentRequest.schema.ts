import { Schema } from 'mongoose';

export const SentRequestSchema = new Schema({
    userId: String,
    studentId: String,
    picture: String,
    nickname: String,
    price: Number,
    status: String,
    lineId: String
});

export interface SentRequest {
    userId: string,
    studentId: string,
    picture: string,
    nickname: string,
    price: number,
    status: string,
    lineId: string
}