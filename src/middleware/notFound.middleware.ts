import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) { throw new HttpException('Not Found', HttpStatus.NOT_FOUND); }

}
