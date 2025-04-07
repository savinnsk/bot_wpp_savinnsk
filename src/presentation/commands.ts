import { responseFromIA } from "./IA";
import { MessageClient, sendMessage } from "./onMessagesUpsert";
import { processSticker } from "./sendSticker";


export const commandMapper = async ({socket , message}: MessageClient ,command : string)=> {
    let messageText =  message?.message?.extendedTextMessage?.text.replace(/^\/ia\s*/, '') || message?.message?.conversation.replace(/^\/ia\s*/, '');

    if(command == "/remover") return admGroupMembersActions({socket , message}, {action : "remove"})
    if(command == "/promover") return admGroupMembersActions({socket , message}, {action : "promote"})
    if(command == "/rebaixar") return admGroupMembersActions({socket , message}, {action : "demote"})
    if(command == "/figura") return processSticker({socket,message})
    if(command == "/ia") return responseFromIA( {socket , message},messageText)
        
    return sendMessage({socket, text : `comando ${command} não existe`, sendTo : message.remotejid} )

}



export async function admGroupMembersActions({socket , message} : MessageClient ,{action} : {action : "promote" | "demote" | "remove"}) {
    try {
        let who = message.message.extendedTextMessage.contextInfo.mentionedJid[0]
        return await socket.groupParticipantsUpdate(message.remotejid, [who], action);

    } catch (error) {
        console.error(`Error to ${action} user:`, error);
        return sendMessage({socket, text : `error ao realizar ação, verifique o comando enviado`, sendTo : message.remotejid} )
        return
    }
}



