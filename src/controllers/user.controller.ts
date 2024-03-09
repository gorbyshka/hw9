import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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
      const result = await this.authService.signUp(email, password);

      return res.status(201).json(result);

    } catch (error) { return res.status(500).json({ message: 'Failed to create user', error: error.message }); }

  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signIn(@Req() req: any, @Res() res: Response) {

    try {

      const result = await this.authService.signIn(req.user);

      return res.status(200).json(result);

    } catch (e) { return res.status(500).json({ message: 'Failed to sign in user', error: e.message }); }

  }

  @UseGuards(AuthGuard('local'))
  @Get('/me')
  async getProfile(@Req() req: any, @Res() res: Response) {

    try {

      const result = await this.authService.getProfile(req.user, req.headers.authorization);

      return res.status(200).json(result);

    } catch (e) { return res.status(500).json({ message: 'Failed to retrieve user profile', error: e.message }); }

  }

}
