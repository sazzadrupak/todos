import { Request, Response } from 'express';
import { post, controller } from './decorators';

@controller('/auth')
class LoginController {
  @post('/logIn')
  postLogin(req: Request, res: Response): void {
    const { email } = req.body;

    if (email) {
      res.send(email.toUpperCase());
    } else {
      res.send('You nmist provide an email');
    }
  }
}