import { connect } from "./connection";
import { load } from "./load";

async function start() {
    const socket = await connect();
    load(socket);
}

start(); 