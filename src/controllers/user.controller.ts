import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Controller()
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,

  ) { }

  @Post('/signup')
  async signUp(@Req() req: Request, @Res() res: Response) {

    try {

      const { email, password } = req.body;

      const user = await this.userService.createUser(email, password);

      const accessToken = await this.authService.createAccessToken(user);

      return res.status(201).json({

        message: 'User created successfully',
        user,
        accessToken,

      });

    } catch (error) {

      return res
        .status(500)
        .json({ message: 'Failed to create user', error: error.message });

    }

  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signIn(@Req() req: any, @Res() res: Response) {

    try {

      if (req.user) {

        const refreshToken = await this.authService.createRefreshToken(req.user);

        return res.status(200).json({
          message: 'User signed in successfully',
          refreshToken,
        });

      } else return res.status(401).json({ message: 'Authentication failed' });

    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: 'Failed to sign in user', error: e.message });

    }

  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/me')
  async getProfile(@Req() req: any, @Res() res: Response) {

    try {

      const user = req.user;

      if (user) {

        const refreshToken = req.headers.authorization.split(' ')[1];

        if (!refreshToken) { return res.status(401).json({ message: 'Refresh token is required' }); }

        const isValidRefreshToken = await this.authService.verifyToken(refreshToken);

        if (!isValidRefreshToken) { return res.status(401).json({ message: 'Invalid refresh token' }); }


        return res.status(200).json({ message: 'User profile retrieved successfully', user });

      } else { return res.status(401).json({ message: 'Authentication failed' }); }

    } catch (e) { return res.status(500).json({ message: 'Failed to retrieve user profile', error: e.message }); }

  }

}
