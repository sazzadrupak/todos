import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getMongoRepository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { SignUp } from "../dto";
import { HttpException } from '../exceptions';
import { TokenData, DataStoredInToken, User as IUser, UserAuthResponse } from '../interfaces';
import { AppLogger, LogTypes } from '../logger';

export class SignUpService {
  public async signUp(body: SignUp): Promise<UserAuthResponse> {
    const { email, firstName, lastName, password } = body;
    let user = await getMongoRepository(UserEntity).findOne({ email });
    if (user) {
      AppLogger.error(LogTypes.UNIQUE_VALIDATION_ERROR, `User with email ${email} already exists`);
      throw new HttpException(400, `User with email ${email} already exists`);
    }

    user = new UserEntity();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    try {
      const newUser = await getMongoRepository(UserEntity).save(user);
      const cookie = this.createCookie(this.createToken(newUser));
      return { firstName, lastName, email, cookie };
    } catch (err) {
      AppLogger.error(LogTypes.DATABASE_ERROR, err.message);
      throw new HttpException(400, 'User validation failed');
    }
  }

  private createToken(user: IUser): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret: string = <string>process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
      email: user.email
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}