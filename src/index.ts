import express from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import cors from "cors"
import multer from "multer"; 
import {v4 as uuidv4} from "uuid"

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


const storage =  multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'src/images/')
  },
  filename: function (req, file, cb) {
      const fileExtension = file.originalname.split('.')[1];

      const filename = uuidv4();

      cb(null, `${filename}.${fileExtension}`)
  }
});

const upload =  multer({ storage });


app.get("/", (_, res) => {
  return res.send({
    message: "Server is running on port " + port,
  });
});


app.post("/profileUpload", upload.single("image") ,async (req, res) => {
    res.json(req.file?.path);
});

app.get("/users", async (_, res) => {
  const users = await AppDataSource.getRepository(User).find();
  return res.send(users);
});

app.post("/user", upload.single("image"), async (req, res) => {

  const {name, CPF, sus_code, phone_number, password } = req.body;
  const pathImage = req.file?.path;
  console.log(pathImage);
  
  const user = await AppDataSource.getRepository(User).create({
    name: name,
    CPF: CPF,
    sus_code: sus_code,
    phone_number: phone_number,
    password: password,
    profile_image: pathImage
  });
  const result = await AppDataSource.getRepository(User).save(user); 
  return res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
