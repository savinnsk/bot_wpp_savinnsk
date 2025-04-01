import {  makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from '@whiskeysockets/baileys';
import * as path from 'path';
import pino from 'pino';
import qrcode from "qrcode";

let qrCodeData = "";

export const connect = async (app) => {

    const { state, saveCreds } = await useMultiFileAuthState(
        path.resolve(path.dirname("."), '..', "assets", "auth", "baileys")
    );

    const {version} = await fetchLatestBaileysVersion();
    
    const socket = makeWASocket({
        printQRInTerminal: true, 
        version,
        logger: pino({ level: "error" }),
        auth:state, 
        browser: ["Chrome (Linux)", "", ""],
        markOnlineOnConnect: true,
    });

   

    socket.ev.on("creds.update", saveCreds);

    
    socket.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect ,  qr } = update; 

        socket.logger.info(socket.requestPairingCode, `${socket.requestPairingCode} 2: ${qr}`)
        if (qr) {
            qrcode.toDataURL(qr, (err, url) => {
                if (!err) {
                    qrCodeData = url;
                }
            });

            
        }

        if (connection == "close" ) {
            const shouldReconnect = 
                lastDisconnect?.error?.cause != DisconnectReason.loggedOut;

            if (shouldReconnect) {
                connect(app);
            }
        }
    });

    app.get("/qr", (req, res) => {
        res.json({ qr: qrCodeData });
    });
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "public/index.html"));
    });
   

    //socket.ev.on("messages.update", (message) => {
     //   console.log("messages.update"); 
   // });


    return socket
    
};