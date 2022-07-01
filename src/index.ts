import express from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import cors from "cors"
import multer from "multer";
import { v4 as uuidv4 } from "uuid"
import bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken"
import { UserType } from "./models/User";
import { ScheduleType } from "./models/Schedule";
import { Schedule } from "./entity/Schedule";
import { authenticateToken } from "./middleware/login"
import { PlaceType } from "./models/Place";
import { Place } from "./entity";

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized");
  })
  .catch((error) => console.error("Error during initialization: ", error));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/images/')
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.')[1];

    const filename = uuidv4();

    cb(null, `${filename}.${fileExtension}`)
  }
});

const upload = multer({ storage });


app.get("/", authenticateToken, (_, res) => {
  return res.send({
    message: "Server is running on port " + port,
  });
});


app.post("/profileUpload", upload.single("image"), async (req, res) => {
  res.json(req.file?.path);
});

app.get("/users", async (_, res) => {
  const users = await AppDataSource.getRepository(User).find();
  return res.send(users);
});

app.post("/user", upload.single("image"), async (req, res) => {

  const { name, CPF, sus_code, phone_number, password, profile_image } = <UserType>req.body;
  const imageURI = profile_image ? profile_image : req.file?.path;

  try {
    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await AppDataSource.getRepository(User).create({
      name: name,
      CPF: CPF,
      sus_code: sus_code,
      phone_number: phone_number,
      password: passwordHash,
      profile_image: imageURI
    });

    const userCreated = await AppDataSource.getRepository(User).save(user);
    return res.status(201).send(userCreated);

  } catch (error) {
    return res.status(400).send({ error: "unable to parse the body" })
  }
});

app.post("/login", async (req, res) => {

  const { sus_code, password } = <UserType>req.body;

  try {
    const user = await AppDataSource.getRepository(User).findOneBy({
      sus_code: sus_code,
    });

    const authentic = bcrypt.compareSync(password, user?.password!);

    if (authentic) {
      const token = jwt.sign({
        id: user?.id,
        sus_code: user?.sus_code,
        CPF: user?.CPF,
      }, "wel1ing7", {
        expiresIn: "1h"
      });

      return res.status(200).send({
        token: token,
        user: user
      });
    }
  } catch (error) {
    return res.status(401).send({
      error: "data and hash arguments required"
    });
  }
})

app.post("/schedule", authenticateToken, async (req, res) => {
  const { date, place, user, status } = <ScheduleType>req.body;

  console.log(req.body);

  try {
    const schedule = await AppDataSource.getRepository(Schedule).create({
      date: date,
      place: place,
      user: user,
      status: status,
    });

    const scheduleCreated = await AppDataSource.getRepository(Schedule).save(schedule);
    return res.status(201).send(scheduleCreated);
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "not found" })
  }
});

app.get("/schedules", authenticateToken, async (_, res) => {
  try {
    const schedules = await AppDataSource.getRepository(Schedule).find(
      {
        relations: {
          user: true,
          place: true,
        }
      }
    );
    return res.send(schedules);
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "not found" })
  }
});


app.post("/place", authenticateToken, async (req, res) => {

  const { name, CEP, address, city, district, number, state } = <PlaceType>req.body;

  try {
    const place = await AppDataSource.getRepository(Place).create({
      name: name,
      address: address,
      CEP: CEP,
      city: city,
      district: district,
      number: number,
      state: state,
    });

    const userCreated = await AppDataSource.getRepository(Place).save(place);
    return res.status(201).send(userCreated);

  } catch (error) {
    return res.status(400).send({ error: "unable to parse the body" })
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
