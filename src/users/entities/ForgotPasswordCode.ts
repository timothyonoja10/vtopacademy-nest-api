import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ForgotPasswordCode {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  code: string;
}