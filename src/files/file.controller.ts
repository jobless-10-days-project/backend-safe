import { Controller, Post, Get, Param, Delete, Res, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipe({ // -- Not added rate limit yet --
            validators: [
                new MaxFileSizeValidator({ maxSize: 3000000 }),
                new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ })
            ]
        })
    ) file: Express.Multer.File | null) {
            const keyName = await this.fileService.upload(file.originalname, file.buffer, file.mimetype);
            return keyName;
        }

    @Get('/:key')
        async dowloadFile(
            @Param('key') key: string,
            // @Res() res: Response
        ) {
            const file = await this.fileService.downloadFile(key);
            return file;
        }

    @Delete('/:key')
    async deleteFile(@Param('key') key: string) {
        const file = await this.fileService.deleteFile(key);
        return file;
    }

    }
