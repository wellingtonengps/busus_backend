import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column({
    type: "bigint",
  })
  CPF: number;

  @Column()
  password: string;

  @Column({
    type: "bigint",
  })
  sus_code: number;

  @Column({
    type: "bigint",
  })
  phone_number: number;

  @Column()
  profile_image: string;
}
