import { IsEmail, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { User as IUser } from '../interfaces';

export class SignUp {
  @MinLength(5)
  @IsNotEmpty()
  public firstName!: IUser['firstName'];

  @MinLength(5)
  @IsNotEmpty()
  public lastName!: IUser['lastName'];

  @IsEmail()
  public email!: IUser['email'];

  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  public password!: IUser['password'];
}