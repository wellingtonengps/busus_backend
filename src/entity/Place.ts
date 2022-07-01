import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Schedule } from "./Schedule";

@Entity()
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column({
    length: 100,
  })
  address: string;

  @Column({
    type: "int",
  })
  number: number;

  @Column({
    type: "int",
  })
  CEP: number;

  @Column({
    length: 100,
  })
  city: string;

  @Column({
    length: 100,
  })
  district: string;

  @Column({
    length: 100,
  })
  state: string;

  @OneToMany(() => Schedule, (schedule) => schedule.place)
  schedules: Schedule[];
}
