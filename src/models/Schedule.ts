import { PlaceType } from "./Place";
import { UserType } from "./User";

export interface ScheduleType {
  id: number;
  date: Date;
  place: PlaceType;
  user: UserType;
  status: string
}
