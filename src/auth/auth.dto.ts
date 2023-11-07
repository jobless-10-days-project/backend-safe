import { Review } from "src/schemas/review.schema";

export class SignInDto {
    email: string;
    password: string;
}

export class SignUpDto {
    email: string;
    password: string;
    firstName: string;
    familyName: string;
}
