import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import variableRouter from "../routes/variable";
import userRouter from "../routes/user";
import wppRouter from "../routes/wpp";
// import wppRouter from "../routes/wpp";
const app = express();
const PORT = 3051;
const apiVersion = "v1";

const corsOptions = {
    origin: [/https:\/\/redeflexbi\.com\.br($|\/.*)/, "http://localhost:3000"]
};
app.use(cors(corsOptions));

app.use(function(req: Request, res: Response, next: NextFunction) {
  console.log(`received - ${req.method} ${req.originalUrl}`);
  const start = process.hrtime.bigint(); // tempo em nanossegundos

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000; // ms
    console.log(`${req.method} ${req.originalUrl} - ${duration.toFixed(2)} ms`);
  });

  next();
});

app.get(`/${apiVersion}`, async function (req, res) {
  res.send('Hello World!');
});


app.use(express.json());
app.use(`/${apiVersion}`, variableRouter);
// app.use(`/${apiVersion}`, wppRouter);
app.use(`/${apiVersion}`, userRouter);

app.listen(PORT, () =>
    console.log(`✨ Server started on ${PORT}`)
);
