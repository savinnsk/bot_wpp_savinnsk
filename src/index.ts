import { connect } from "./connection.ts";
import { load } from "./load.ts";

async function start() {
    const socket = await connect();
    load(socket);
}

start(); 