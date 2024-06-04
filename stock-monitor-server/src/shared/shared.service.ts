import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  success(message: string, data?: any): any {
    return { message, data };
  }

  error(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ): any {
    return { message, statusCode };
  }
}
