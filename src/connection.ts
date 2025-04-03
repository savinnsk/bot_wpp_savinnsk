import {  makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from '@whiskeysockets/baileys';
import * as path from 'path';
import pino from 'pino';
import qrcode from "qrcode";

let qrCodeData = "";

export const connect = async (app) => {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_info_baileys");
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

        if (qr) {
            const filePath = path.join(__dirname, "public", "qrcode.png");
    
          
            qrcode.toFile(filePath, qr, (err) => {
                if (err) {
                    console.error("Erro ao salvar o QR Code:", err);
                } else {
                    console.log("QR Code salvo em:", filePath);
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



    //socket.ev.on("messages.update", (message) => {
     //   console.log("messages.update"); 
   // });


    return socket
    
};