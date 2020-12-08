import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn
} from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity("users")
export class UserEntity extends BaseEntity {

  @ObjectIdColumn()
  _id!: string;

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @Column()
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}