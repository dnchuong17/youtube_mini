import express from 'express';
import rootRoutes from "./src/routes/rootRoutes.js";
import cors from 'cors';
import cookiesParser from 'cookie-parser';


const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookiesParser());

app.use(express.static("."));

app.use(express.json());


app.use(rootRoutes);


const port = 3000;

app.listen((port), () => {
    console.log(`Server is running on port: ${port}`);
})
