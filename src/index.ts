import path from "path";
import { connect } from "./connection";
import { load } from "./load";
import express from "express"
import open from "open"; 

const app = express();
const PORT = 80;
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => {
    console.log(`Servidor rodando em porta ${80}`);
    //open(`http://localhost:${PORT}`);
    start(); 
});


app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


async function start() {
    const socket = await connect(app);
    load(socket);
    
}

