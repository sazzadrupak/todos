import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser } from '../interfaces';

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, maxlength: 20 },
},
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  });

UserSchema.virtual('fullName').get(function (this: { firstName: string, lastName: string }) {
  return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model<IUser & Document>('User', UserSchema);