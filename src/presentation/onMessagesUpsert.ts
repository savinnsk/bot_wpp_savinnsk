import { proto } from "baileys";
import { connect } from "../connection";



export interface MessageFormatted  {
    isFromMe: boolean | null | undefined;
    remotejid: string | null | undefined;
    nameOfSender: string | null | undefined;
    message: proto.IMessage | null | undefined;
}

export interface MessageClient  {
    socket :  Awaited<ReturnType<typeof connect>>,
    message : MessageFormatted
}


export const onMessagesUpsert =  async ({ socket, message } : MessageClient) => {
    if(message.remotejid){
    socket.sendMessage(message.remotejid, {
        text:"test",
        force: false,
        })
    }
    
};

