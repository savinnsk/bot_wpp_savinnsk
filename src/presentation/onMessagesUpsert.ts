import { connect } from "../connection";
import { MessageFormatted } from "@/load";
import { commandMapper } from "./commands";
import { processSticker } from "./sendSticker";

export interface MessageClient  {
    socket :  Awaited<ReturnType<typeof connect>>,
    message : MessageFormatted
}


export const onMessagesUpsert =  async ({ socket, message } : MessageClient) => {
    const commandIfExist = message?.message?.extendedTextMessage?.text?.match(/^\/\S+/)?.[0] || message?.message?.conversation?.match(/^\/\S+/)?.[0]
    console.log("command",commandIfExist)

    if (message?.message?.imageMessage) {
       processSticker({socket,message})
    }

    if(commandIfExist){
        return await commandMapper({socket , message},commandIfExist)       
    }
};


export const sendMessage = async ({socket ,sendTo ,text}: 
    {socket : Awaited<ReturnType<typeof connect>> , text : string , sendTo : string })=>{
    
        socket.sendMessage(sendTo,{
        text:text,
        force: false,
        })
} 

