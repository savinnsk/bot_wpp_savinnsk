import axios from "axios";
import { MessageClient, sendMessage } from "./onMessagesUpsert";

export const responseFromIA = async ({socket , message}: MessageClient  , text : string)=>{ 
    
   const responseFromIA =  await axios.post("http://localhost:11434/api/generate", {
    model: "gemma3",
    prompt: `
    você é um atendente virtual
    responda essa mensagem de forma rapida e objetiva com a personalide essa mensagem :
    ${text}`,
    stream: false

  })

  return sendMessage({socket, text : `${responseFromIA.data.response}`, sendTo : message.remotejid} )
 

}