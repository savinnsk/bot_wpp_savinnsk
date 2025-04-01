import { connect } from "./connection";
import { load } from "./load";
import express from "express"

const app = express();
const PORT = 5000;



app.listen(PORT, () => {
    console.log(`Servidor rodando em ${80}`);
    start(); 
});


async function start() {
    const socket = await connect(app);
    load(socket);
    
}

