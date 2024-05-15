import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class School {
  
  @PrimaryGeneratedColumn()
  schoolId: number;

  @Column()
  name: string;
  
  @Column()
  number: number;
}
