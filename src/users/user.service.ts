import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto, ReviewDto, UpdateUserDto, sentRequestDto } from './user.dto';
import { SignUpDto } from 'src/auth/auth.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<UserDocument>
    ) {}
    
    async find(conditions: any, fieldsToExclude: string[]): Promise<UserDocument[]>{

        const projection = fieldsToExclude.reduce((acc, field) => {
            acc[field] = 0;
            return acc;
          }, {});

        return this.userModel.find(conditions).select(projection).exec()
    }

    async getDetail(studentId: string, fieldsToExcludeDetail: string[]): Promise<UserDocument[]> {
        const conditions = { studentId: studentId }
        
        const projection = fieldsToExcludeDetail.reduce((acc, field) => {
            acc[field] = 0;
            return acc;
          }, {});

        return this.userModel.find(conditions).select(projection).exec()
    }

    async findById(id: string) {
        return this.userModel.findById(id).exec();
    }

    async findOne(conditions: any){
        return this.userModel.findOne(conditions).exec()
    }

    async findOneByStudentId(studentId: string){
        return this.userModel.findOne({"studentId":studentId}).exec()
    }

    async findOneByEmail(email: string){
        return this.userModel.findOne({"email":email}).exec()
    }

    async checkProfileStatus(studentId: string){
        const user = await this.userModel.findOne({"studentId":studentId}).exec();
        console.log(user);
        if(user.nickname == null
            || user.age == null
            || user.faculty == null
            || user.degree == null
            || user.gender == null
            || (user.sellingStatus == true 
                && (user.description == null
                || user.price == null
                || user.lineId == null))
            ) return false
        return true
    }

    async sendRequest(buyerId: string, sellerId: string){
        await this.createSentRequest(buyerId, sellerId);
        await this.createIncomingRequest(buyerId, sellerId);
        return this.userModel.findById(buyerId).exec()
    }

    async acceptRequest(buyerId: string, sellerId: string){
        await this.changeRequestStatus(buyerId, sellerId, "Accepted", "Pending");
        await this.deleteIncomingRequest(buyerId, sellerId);
    }

    async rejectRequest(buyerId: string, sellerId: string){
        await this.changeRequestStatus(buyerId, sellerId, "Rejected", "Pending");
        await this.deleteIncomingRequest(buyerId, sellerId);
    }

    async buyConfirm(buyerId: string, sellerId: string){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        
        const index = buyerUser.sentRequests.findIndex((element) => 
        element.studentId === sellerUser.studentId && element.status === "Accepted");

        const price = buyerUser["sentRequests"][index].price;

        if(await this.isPayable(buyerId, sellerId, price)){
            await this.changeRequestStatus(buyerId, sellerId, "Confirmed", "Accepted");
            await this.pay(buyerId, sellerId, price);
            await this.createPurchaseHistory(buyerId, sellerId, "12");
            sellerUser.sold += 1;
            await sellerUser.save();
            return buyerUser["sentRequests"][index].lineId
        }

        else{
            throw new ForbiddenException('Not Enough Money');
        }
    }
    async createSentRequest(buyerId: string, sellerId: string){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        const item = {
            userId: sellerUser.id,
            studentId: sellerUser.studentId,
            picture: sellerUser.previewPicture,
            nickname: sellerUser.nickname,
            price: sellerUser.price,
            status: "Pending",
            lineId: sellerUser.lineId
        }
        return this.findByIdAndAddItem(buyerId, "sentRequests", item)
    }

    async createIncomingRequest(buyerId: string, sellerId: string){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        const item = {
            userId: buyerUser.id,
            studentId: buyerUser.studentId,
            picture: buyerUser.previewPicture,
            nickname: buyerUser.nickname,
            age: buyerUser.age,
            gender: buyerUser.gender
        }
        await this.findByIdAndAddItem(sellerId, "incomingRequests", item);
    }

    async createPurchaseHistory(buyerId: string, sellerId: string, date: string){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        const currentDate = new Date();
        const gregorianYear = currentDate.getFullYear() - 543;
        const formattedDate = currentDate.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Bangkok'
        });

        const index = buyerUser.sentRequests.findIndex((element) => 
        element.studentId === sellerUser.studentId && element.status === "Confirmed");

        const item = {
            userId: sellerUser.id,
            studentId: sellerUser.studentId,
            picture: buyerUser["sentRequests"][index].picture,
            nickname: buyerUser["sentRequests"][index].nickname,
            price: buyerUser["sentRequests"][index].price,
            date: formattedDate
        }
        await this.findByIdAndAddItem(buyerId, "purchaseHistories", item);
    }

    async createReview(buyerId: string, sellerId: string, dto: ReviewDto){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        const item = {
            studentId: dto.studentId,
            picture: dto.picture,
            nickname: dto.nickname,
            score: dto.score,
            text: dto.text
        }
        await this.findByIdAndAddItem(sellerId, "reviews", item);
        await this.updateAverageScore(sellerId);
        return this.userModel.findById(sellerId).exec();
    }

    async deleteSentRequest(buyerId: string, sellerId: string, requestId: string){
        //const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        const item = {
            id: requestId
        }
        await this.findByIdAndDeleteItem(buyerId, "sentRequests", item , "id");
        return this.userModel.findById(buyerId).exec();
    }

    async deleteIncomingRequest(buyerId: string, sellerId: string){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        const item = {
            studentId: buyerUser.studentId
        }
        await this.findByIdAndDeleteItem(sellerId, "incomingRequests", item , "studentId");
        return this.userModel.findById(sellerId).exec();
    }

    async deleteReview(buyerId: string, sellerId: string){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        const item = {
            studentId: buyerUser.studentId
        }
        await this.findByIdAndDeleteItem(sellerId, "reviews", item, "studentId");
        await this.updateAverageScore(sellerId);
        return this.userModel.findById(sellerId).exec();
    }

    

    async isPayable(buyerId: string, sellerId: string, amount: number){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        return (buyerUser.balance >= amount)
    }

    async pay(buyerId: string, sellerId: string, amount: number){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();

        buyerUser.balance = buyerUser.balance - amount;
        sellerUser.balance = sellerUser.balance + amount;
        await buyerUser.save();
        await sellerUser.save();
    }

    async changeRequestStatus(buyerId: string, sellerId: string, newStatus: string, oldStatus: string){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const buyerUser = await this.userModel.findById(buyerId).exec();
        const item = {
            studentId: sellerUser.studentId,
            status: oldStatus
        }
        const index = buyerUser.sentRequests.findIndex((element) => 
        element.studentId === item.studentId && element.status === item.status);
        buyerUser["sentRequests"][index].status = newStatus;
        await buyerUser.save();
    }

    async updateAverageScore(sellerId: string){
        const sellerUser = await this.userModel.findById(sellerId).exec();
        const sumScore = sellerUser.reviews.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.score;
          }, 0);
          console.log(sumScore,sellerUser.reviews.length);
        
        sellerUser.averageScore = sellerUser.reviews.length ? sumScore/sellerUser.reviews.length :0;
        await sellerUser.save();
    }

    async createUser(user: CreateUserDto){
        const newUser = new this.userModel(user);
        newUser.balance = 10000;
        newUser.sold = 0;
        newUser.averageScore = 0;
        newUser.previewPicture = "https://nestjs-uploaded.s3.us-east-1.amazonaws.com/_2b_10_U2eb92sW8hcJYGWoCxVTse_4eC_CMa0kxY5hInog_Y6BTFLUBirtW.jpeg";
        newUser.sellingStatus = false;
        return newUser.save();
    }

    async findByIdAndAddItem(id: string, arrayName: string, item: any){
        const user = await this.userModel.findById(id).exec();
        if (user[arrayName] && Array.isArray(user[arrayName])){
            user[arrayName].push(item);
            await user.save();
        }
        return user;
    }

    async findByIdAndDeleteItem(id: string, arrayName: string, item: any, key: string) {
        
        const user = await this.userModel.findById(id).exec();
        if (user[arrayName] && Array.isArray(user[arrayName])) {
          const index = user[arrayName].findIndex((element) => element[key] === item[key]);
        console.log(item._id);
          if (index !== -1) {
            user[arrayName].splice(index, 1);
            await user.save();
          }
        }
        return user;
      }

    async findByIdAndUpdateUser(id: string, updateUserDto: UpdateUserDto) {

        if(updateUserDto.nickname == null
            || updateUserDto.age == null
            || updateUserDto.faculty == null
            || updateUserDto.degree == null
            || updateUserDto.gender == null
            || (updateUserDto.sellingStatus == true 
                && (updateUserDto.description == null
                || updateUserDto.price == null
                || updateUserDto.lineId == null))
            ) throw new ForbiddenException('Incomplete Profile');
        const user = await this.userModel.findById(id).exec();
        Object.assign(user, updateUserDto);
        const updatedUserDbReturn = await user.save();
        const extractedUserInfo: any = { ...updatedUserDbReturn };
        const processedUserInfo = extractedUserInfo._doc;
        delete processedUserInfo.completed;

        const fieldsToExcludeDetail = ["password", "sentRequests", "incomingRequests", "purchaseHistories"]

        for (const field of fieldsToExcludeDetail) {
            delete processedUserInfo[field];
        }

        return { ...processedUserInfo };
        }

}