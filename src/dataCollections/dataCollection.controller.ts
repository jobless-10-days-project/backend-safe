import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DataCollectionService } from './dataCollection.service';

require('dotenv').config();

@Controller('datacollection')
export class DataCollectionController {
  constructor(private readonly dataCollectionService: DataCollectionService) {}

  @Get()
    async findAll() {
        return this.dataCollectionService.findById(process.env.DATA_COLLECTION_ID);
    }

  @Get('genders') // get all genders
    async findGenders() {
        return (await this.dataCollectionService.findById(process.env.DATA_COLLECTION_ID)).genders;
    }

  @Post('gender') // add gender
    async addGender(@Body() gender: string){
      return this.dataCollectionService.addGender(process.env.DATA_COLLECTION_ID, gender);
    }
}
