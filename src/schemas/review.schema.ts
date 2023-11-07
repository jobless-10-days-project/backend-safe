import { Schema } from 'mongoose';

export const ReviewSchema = new Schema({
    studentId: String,
    picture: String,
    nickname: String,
    score: Number,
    text: String
});

export interface Review {
    studentId: string,
    picture: string,
    nickname: string,
    score: number,
    text: string
}