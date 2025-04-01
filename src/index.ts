import { connect } from "./connection";
import { load } from "./load";
import express from "express"

const app = express();
const PORT = 80;



app.listen(PORT, () => {
    console.log(`Servidor rodando em ${80}`);
    start(); 
});


app.get("/", (req, res) => {
    res.send("Servidor rodando...");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Servidor ativo!" });
});

async function start() {
    const socket = await connect(app);
    load(socket);
    
}

