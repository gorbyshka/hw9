import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

    constructor(private userService: UserService) { }

    async validateUser(email: string, password: string): Promise<any> {

        const user = await this.userService.findUserByEmail(email);

        if (user && user.password === password) return user;

        return null;
    }

    async createAccessToken(user: any): Promise<string> {

        try {

            const payload = { email: user.email, sub: user._id };

            return jwt.sign(payload, '123', { expiresIn: '15m' });

        } catch (e) { throw new Error('Not created aceessToken'); }

    }

    async createRefreshToken(user: any): Promise<string> {

        try {

            const payload = { email: user.email, sub: user._id };
            return jwt.sign(payload, '123', { expiresIn: '7d' });

        } catch (e) { throw new Error('Not created refreshToken'); }

    }

    async verifyToken(token: string): Promise<boolean> {

        try {

            jwt.verify(token, '123');
            return true;

        } catch (err) { return false; }

    }

}
