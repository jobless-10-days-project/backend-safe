import { IncomingRequest } from "src/schemas/incomingRequest.schema";
import { PurchaseHistory } from "src/schemas/purchaseHistory.schema";
import { Review } from "src/schemas/review.schema";
import { SentRequest } from "src/schemas/sentRequest.schema";

export class CreateUserDto {
    studentId: string;
    password: string;
}

export class UpdateUserDto{
    password: string;
    balance: number;
    sellingStatus: boolean;
    nickname: string;
    faculty: string;
    degree: number;
    age: number;
    gender: string;
    purchaseHistories: PurchaseHistory[];
    previewPicture: string;
    supplementPictures: string[];
    price: number;
    lineId: string;
    sold: number;
    description: string;
    incomingRequests: IncomingRequest[];
    sentRequests: SentRequest[];
    averageScore: number;
    reviews: Review[];
}

export class FindMeDto{
    _id: string;
    studentId: string;
    balance: number;
    sellingStatus: boolean;
    nickname: string;
    faculty: string;
    degree: number;
    age: number;
    gender: string;
    purchaseHistories: PurchaseHistory[];
    previewPicture: string;
    supplementPictures: string[];
    price: number;
    lineId: string;
    sold: number;
    description: string;
    incomingRequests: IncomingRequest[];
    sentRequests: SentRequest[];
    averageScore: number;
    reviews: Review[];
}

export class FilterUserDto{
    sellingStatus: boolean;
    nickname: string;
    faculty: string;
    degree: number;
    age: number;
    gender: string;
}

export class IncomingRequestDto{
    userId: string;
    studentId: string;
    picture: string;
    nickname: string;
    age: number;
    gender: string;
}

export class sentRequestDto{
    userId: string;
    studentId: string;
    picture: string;
    nickname: string;
    price: number;
    status: string;
    lineId: string;
}

export class PurchaseHistoryDto{
    userId: string;
    studentId: string;
    picture: string;
    nickname: string;
    price: number;
    date: string;
}

export class UserIdDto{
    id: string;
}

export class ReviewDto{
    studentId: string;
    picture: string;
    nickname: string;
    score: number;
    text: string;
}

export class SellingUserDto{
    sellingStatus: boolean;
    nickname: string;
    faculty: string;
    degree: number;
    age: number;
    gender: string;
    previewPicture: string;
    supplementPictures: string[];
    price: number;
    lineId: string;
    sold: number;
    description: string;
    averageScore: number;
    reviews: Review[];
}

