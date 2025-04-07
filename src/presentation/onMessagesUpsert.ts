import { connect } from "../connection";
import { MessageFormatted } from "@/load";
import { commandMapper } from "./commands";
import { responseFromIA } from "./IA";


export interface MessageClient  {
    socket :  Awaited<ReturnType<typeof connect>>,
    message : MessageFormatted
}


export const onMessagesUpsert =  async ({ socket, message } : MessageClient) => {
    const commandIfExist = message?.message?.extendedTextMessage?.text?.match(/^\/\S+/)?.[0].toLowerCase() || message?.message?.conversation?.match(/^\/\S+/)?.[0].toLowerCase()
    const commandImage = message?.message?.imageMessage?.caption?.match(/^\/\S+/)?.[0].toLowerCase()
    //let messageText =  message?.message?.extendedTextMessage?.text.replace(/^\/ia\s*/, '') || message?.message?.conversation.replace(/^\/ia\s*/, '');

    if(commandIfExist || commandImage){      
        return await commandMapper({socket , message},commandIfExist || commandImage)       
    }

  //  return responseFromIA( {socket , message},messageText)
};


export const sendMessage = async ({socket ,sendTo ,text}: 
    {socket : Awaited<ReturnType<typeof connect>> , text : string , sendTo : string })=>{
    
        socket.sendMessage(sendTo,{
        text:text,
        force: false,
        })
} 

