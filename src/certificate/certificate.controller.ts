import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { Response } from 'express';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get(':studentId')
  async generateCertificate(
    @Param('studentId') studentId: number,
    @Res() res: Response,
  ) {
    try {
      const filePath =
        await this.certificateService.generateCertificate(studentId);

      if (filePath instanceof HttpException) {
        throw new HttpException(
          'Certificate could not be generated',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      res.sendFile(filePath, (err) => {
        if (err) {
          throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }
      });
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
