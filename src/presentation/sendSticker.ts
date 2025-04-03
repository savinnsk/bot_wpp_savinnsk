import fs from "fs"
import path from "path";
import sharp from "sharp";
import { MessageClient} from "./onMessagesUpsert";
import  downloadContentFromMessage from "@whiskeysockets/baileys";


export const processSticker = async ({ socket , message} : MessageClient ) => {
    console.log("Imagem recebida!");

    // Extrair informações da imagem
    const mediaMessage = message.message.imageMessage;
    const sender = message.remotejid;

    // Baixar a imagem
    const imagePath = await downloadImage(mediaMessage, "imagem.jpg");

    // Converter em figurinha
    const stickerPath = await convertToSticker(imagePath);

    // Enviar figurinha de volta
    await sendSticker(socket, sender, stickerPath);
}


export async function downloadContentWithTimeout(mediaMessage, timeoutMs = 5000) {
    return Promise.race([
        downloadContentFromMessage(mediaMessage),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout ao baixar a imagem")), timeoutMs))
    ]);
}

export async function downloadImage(mediaMessage, filename) {
    console.log("antes")
    const stream = await downloadContentWithTimeout(mediaMessage);
    console.log("dep")
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
}

export async function convertToSticker(imagePath) {
    const stickerPath = imagePath.replace(".jpg", ".webp");

    await sharp(imagePath)
        .resize(512, 512, { fit: "contain" })
        .toFormat("webp")
        .toFile(stickerPath);

    console.log("Figurinha criada:", stickerPath);
    return stickerPath;
}

export async function sendSticker(sock, jid, stickerPath) {
    await sock.sendMessage(jid, { sticker: { url: stickerPath } });
    console.log("Figurinha enviada para:", jid);
}