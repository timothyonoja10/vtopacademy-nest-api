import { IsNotEmpty } from 'class-validator';

export class CreateSchoolDto {
  @IsNotEmpty()
  readonly name: string;
  readonly number: number;
}
