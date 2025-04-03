import { MessageClient, sendMessage } from "./onMessagesUpsert";


export const commandMapper = async ({socket , message}: MessageClient ,command : string)=> {
    if(command == "/remover") return admGroupMembersActions({socket , message}, {action : "remove"})
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



