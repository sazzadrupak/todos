import { NextFunction, Request, Response } from 'express';
import { SignUp } from '../dto';
import { post, controller, bodyValidator } from './decorators';
import { SignUpService } from '../services';
import { UserAuthResponse } from '../interfaces';
const signUpService = new SignUpService();

@controller('/auth')
class SignupController {
  @post('/signUp')
  @bodyValidator(SignUp)
  async postLogin(req: Request, res: Response, next: NextFunction) {
    const body: SignUp = req.body;

    try {
      const result: UserAuthResponse = await signUpService.signUp(body);
      res.setHeader('Set-Cookie', [result.cookie]);
      return res.status(200).send({ firstName: result.firstName, lastName: result.lastName, email: result.email });
    } catch (error) {
      next(error);
    }
  }
}