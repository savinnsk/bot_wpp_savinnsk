import {  makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from '@whiskeysockets/baileys';
import path from 'path';
import pino from 'pino';
import { questions, onlyNumbers } from "./utils/index.ts";

export const connect = async () => {

    const { state, saveCreds } = await useMultiFileAuthState(
        path.resolve(path.dirname("."), '..', "assets", "auth", "baileys")
    );

    const {version} = await fetchLatestBaileysVersion();
    
    const socket = makeWASocket({
        printQRInTerminal: true, 
        version,
        logger: pino({ level: "error" }),
        auth: state, 
        browser: ["Chrome (Linux)", "", ""],
        markOnlineOnConnect: true,
    });

   

    socket.ev.on("creds.update", saveCreds);

    
    socket.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update; 

        if (connection == "close" ) {
            const shouldReconnect = 
                lastDisconnect?.error?.cause != DisconnectReason.loggedOut;

            if (shouldReconnect) {
                connect();
            }
        }
    });

      
   

    socket.ev.on("messages.update", (message) => {
        console.log(message); 

        
        
    });


    return socket
    
};