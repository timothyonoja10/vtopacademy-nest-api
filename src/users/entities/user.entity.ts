import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string; 

  @Column({
    type: "set",
    enum: Role,
    default: [Role.User],
  })
  roles: Role[];

}