import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { CreateUserDto, FilterUserDto, ReviewDto, UpdateUserDto, UserIdDto} from './user.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

const fieldsToExclude = ["password", "balance", "lineId", "sentRequests", "incomingRequests", "purchaseHistories", "reviews.reviewerId" , "reviews._id"]
const fieldsToExcludeDetail = ["password", "sentRequests", "incomingRequests", "purchaseHistories"] // TODO...

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('find/filter') // get all user with filter passed in Body (if the filter field is empty, do not add it to Body)
    async findtest(@Body() filterUserDto: FilterUserDto) {
        return this.userService.find(filterUserDto, fieldsToExclude);
    }

    @UseGuards(JwtAuthGuard)
    @Get('detail/:id')
    async getUserDetail(@Param('id') studentId: string) {
        return this.userService.getDetail(studentId, fieldsToExcludeDetail);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profilestatus') // check if profile is completely edited 
    async getProfileStatus(@Request() req) {
        return this.userService.checkProfileStatus(req.user.studentId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/find/me') // get own info 
    async getUserMe(@Request() req) {
        const user = await this.userService.find({"_id":req.user.id},["sentRequests.lineId","password"]);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Post('request/send/:id') // send request to someone
    async sendRequest(@Request() req, @Param('id') sellerId: string){
        return this.userService.sendRequest(req.user.id,sellerId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('review/:id') // review someone (in ReviewDto only need to include score and text)
    async createReview(@Request() req,@Param('id') sellerId: string, @Body() dto: ReviewDto){
        const user = await this.userService.findById(req.user.id);
        const completedReviewDto = {
            studentId: user.studentId,
            picture: user.previewPicture,
            nickname: user.nickname,
            score: dto.score,
            text: dto.text
        }

        return this.userService.createReview(req.user.id, sellerId, completedReviewDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('review/remove/:id') // remove review 
    async removeReview(@Request() req,@Param('id') sellerId: string){
        return this.userService.deleteReview(req.user.id, sellerId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('request/accept/:id') // accept incoming request from buyer
    async acceptRequest(@Request() req,@Param('id') buyerId: string){
        return this.userService.acceptRequest(buyerId, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('request/reject/:id') // reject incoming request from buyer
    async rejectRequest(@Request() req,@Param('id') buyerId: string){
        return this.userService.rejectRequest(buyerId, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('request/remove/:id') // reject incoming request from buyer
    async removeRequest(@Request() req,@Param('id') requestId: string){
        return this.userService.deleteSentRequest(req.user.id, "", requestId );
    }

    @UseGuards(JwtAuthGuard)
    @Post('buy/:id') // buy the seller (this can only happen after seller has accepted the request)
    async buy(@Request() req,@Param('id') sellerId: string){
        return this.userService.buyConfirm(req.user.id, sellerId);
    }

    @Post() // createUser
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update') // update info
    async updateUserInfo(@Request() req, @Body() updateUerDto: UpdateUserDto,) {
        return await this.userService.findByIdAndUpdateUser(req.user.id, updateUerDto);
        
    }
}