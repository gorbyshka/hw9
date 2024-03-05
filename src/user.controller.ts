import { Controller, Post, Req, Res,  UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Req() req: Request, @Res() res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.createUser(email, password);
      return res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signIn(@Req() req: any, @Res() res: Response) {
    try {
      if (req.user) {
        return res.status(200).json({ message: 'User signed in successfully', user: req.user });
      } else {
        return res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Failed to sign in user', error: error.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me')
  async getProfile(@Req() req: any, @Res() res: Response) {
    try {
      if (req.user) {
        return res.status(200).json({ message: 'User profile retrieved successfully', user: req.user });
      } else {
        return res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve user profile', error: error.message });
    }
  }
}
