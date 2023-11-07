import { Injectable } from '@nestjs/common';
import { PutObjectCommand, GetObjectCommand, S3Client, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import * as bcrypt from 'bcrypt';

require('dotenv').config();

@Injectable()
export class FileService {
    private readonly s3Client = new S3Client({
        credentials: {
            accessKeyId: process.env.NASMEEN_KEY_ID,
            secretAccessKey: process.env.NASMEEN_ACCESS_KEY
        },
        region: this.configService.getOrThrow('AWS_S3_REGION')
    });

    constructor(private readonly configService: ConfigService) { }

    async upload(fileName: string, file: Buffer, fileType: string) {
        let nameToHash = fileName;
        let fileDot = '.' + fileType.substring(6)
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(nameToHash, salt);
        const hashWoSpecialChar = hash.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
        const keyName = hashWoSpecialChar + fileDot;

        const putObjectParams = {
            Bucket: 'nestjs-uploaded',
            Key: keyName,
            Body: file,
        };

        await this.s3Client.send(
            new PutObjectCommand(putObjectParams)
        )

        return keyName;
    }

    async downloadFile(fileName: string) {
        const getObjectParams = {
            Bucket: 'nestjs-uploaded',
            Key: fileName,
        };

        try {
            const getObjectCommand = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(this.s3Client, getObjectCommand); // No Expired
            return url.split('?')[0];
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(fileName: string) {
        const getObjectParams = {
            Bucket: 'nestjs-uploaded',
            Key: fileName,
        };

        try {
            const deleteObjectCommand = new DeleteObjectCommand(getObjectParams);
            await this.s3Client.send(deleteObjectCommand);
            return fileName;
        } catch (error) {
            throw error;
        }
    }

}
