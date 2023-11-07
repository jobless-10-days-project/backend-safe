import { Schema } from 'mongoose';

export const IncomingRequestSchema = new Schema({
    userId: String,
    studentId: String,
    picture: String,
    nickname: String,
    age: Number,
    gender: String
});

export interface IncomingRequest {
    userId: string,
    studentId: string,
    picture: string,
    nickname: string,
    age: number,
    gender: string
}