import { proto } from "baileys";
import { MessageFormatted } from "../load";


export const onlyNumbers = (text : string) => text.replace(/[^0-9]/g, "");


export const mapperMessage = (message :  proto.IWebMessageInfo[]) : MessageFormatted=> {
    return {
        isFromMe : message[0]['key'].fromMe,
        remotejid : message[0]['key'].remoteJid,
        id : message[0]['key'].id,
        nameOfSender : message[0].pushName,
        message :  message[0].message,
    }

}


//deprecated

/*export const extractDataFromMessage = (webMessage) => {
    const textMessage = webMessage .message?.conversation;
    const extendedTextMessage = webMessage.message?.extendedTextMessage
    const extendedTextMessageText = extendedTextMessage?.text;
    const imageTextMessage = webMessage.message?.imageMessage?.caption;
    const videoTextMessage = webMessage.message?.videoMessage?.caption;

    const fullMessage = textMessage || extendedTextMessage || imageTextMessage || videoTextMessage;

    if (!fullMessage) {
        return {
            remoteJid: null,
            userJid: null,
            prefix: null,
            commandName: null,
            isReply: null,
            replyJid: null,
            args: [],
        };
    }

    const isReply = !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

    const replyJid = !!extendedTextMessage && !!extendedTextMessage.contextInfo?.participant
    ? extendedTextMessage.contextInfo.participant
    : null;

    const userJid = webMessage?.key?.participant?.replace(
        /:[0=9][0=9]|:[0-9]/g,
        ""
    );

    const [command, ...args] = fullMessage.split(" ");
    const prefix = command.charAt(0);

    const commandWithoutPrefix = command.replace(new RegExp(`^[${prefix}]+`));

    return {
        remoteJid: webMessage?.key?.remoteJid,
        prefix,
        userJid,
        replyJid,
        isReply,
        commandName: commandWithoutPrefix,
        args,
    };
}*/