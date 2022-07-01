import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "./Place";
import { User } from "./User";


@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamptz" })
  date: Date;

  @Column()
  status: string

  @ManyToOne(() => User, (user) => user.schedules)
  user: User;

  @ManyToOne(() => Place, (place) => place.schedules)
  place: Place;
}
