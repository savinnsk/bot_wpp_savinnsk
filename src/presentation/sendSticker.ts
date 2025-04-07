import fs from "fs"
import path from "path";
import sharp from "sharp";
import { MessageClient} from "./onMessagesUpsert";
import  downloadContentFromMessage, { assertMediaContent, downloadMediaMessage } from "@whiskeysockets/baileys";


export const processSticker = async ({ socket , message} : MessageClient ) => {
    try {


    // Extrair informações da imagem
    const mediaMessage = message.message.imageMessage;
    const sender = message.remotejid;

    // Baixar a imagem
    const imagePath = await downloadImage(message, "../public/imagem.jpg");

    // Converter em figurinha
    const stickerPath = await convertToSticker(imagePath);

    // Enviar figurinha de volta
    await sendSticker(socket, sender, stickerPath);
    }catch(e){
        console.log("error to processSticker", e)
        return
    }
}


export async function downloadContentWithTimeout(mediaMessage: any, timeoutMs = 5000) {
    try {
    return Promise.race([
        downloadMediaMessage(mediaMessage, "stream", {}),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout ao baixar a imagem")), timeoutMs)
        )
    ]);

    } catch (error) {
        console.log("error downloadContentWithTimeout", error)
        return
    }
}

export async function downloadImage(mediaMessage, filename) {
    try {
    const stream = await downloadContentWithTimeout(mediaMessage);
    if (!stream) {
        throw new Error("Erro ao obter o stream da imagem");
    }

    const filePath = path.join(__dirname, filename);
    const bufferArray: Buffer[] = [];

    for await (const chunk of stream as any) {
        bufferArray.push(chunk);
    }

    const buffer = Buffer.concat(bufferArray);
    fs.writeFileSync(filePath, buffer);
    
    console.log("Imagem baixada:", filePath);
    return filePath;
    }catch(e){
        console.log("error downloadContentWithTimeout", e)
    }
}

export async function convertToSticker(imagePath) {
    try{
    const stickerPath = imagePath.replace(".jpg", ".webp");

    await sharp(imagePath)
        .resize(512, 512, { fit: "contain" })
        .toFormat("webp")
        .toFile(stickerPath);

    console.log("Figurinha criada:", stickerPath);
    return stickerPath;
    }catch(e){
        console.log("error convertToSticker", e)
    }
}

export async function sendSticker(sock, jid, stickerPath) {
    try {
    await sock.sendMessage(jid, { sticker: { url: stickerPath } });
    console.log("Figurinha enviada para:", jid);
    }catch(e){
        console.log("error sendSticker", e)
    }
}