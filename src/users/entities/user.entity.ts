import { Entity, Column, PrimaryGeneratedColumn,
    ManyToMany, JoinTable } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string; 

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

}