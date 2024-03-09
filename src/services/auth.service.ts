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

        } catch (e) { throw new Error('Not created accessToken'); }

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

    async signUp(email: string, password: string): Promise<any> {

        const user = await this.userService.createUser(email, password);

        const accessToken = await this.createAccessToken(user);

        return {

            message: 'User created successfully',
            user,
            accessToken,

        };

    }

    async signIn(user: any): Promise<any> {

        const refreshToken = await this.createRefreshToken(user);

        return {

            message: 'User signed in successfully',
            refreshToken,

        };

    }

    async getProfile(user: any, authorizationHeader: string): Promise<any> {

        const refreshToken = authorizationHeader.split(' ')[1];

        if (!refreshToken) throw new Error('Refresh token is required');

        const isValidRefreshToken = await this.verifyToken(refreshToken);

        if (!isValidRefreshToken) throw new Error('Invalid refresh token');

        return {

            message: 'User profile retrieved successfully',
            user,

        };

    }

}
