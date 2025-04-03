import { proto } from "baileys";
import { TIMEOUT_IN_MILLISECONDS_BY_EVENT } from "./config";
import { connect } from "./connection";
import { onMessagesUpsert } from "./presentation/onMessagesUpsert";
import { mapperMessage } from "./utils/index";



export interface MessageFormatted  {
    id: string | null | undefined;
    isFromMe: boolean | null | undefined;
    remotejid: string | null | undefined;
    nameOfSender: string | null | undefined;
    message: proto.IMessage | null | undefined;
}



export const load = (socket : Awaited<ReturnType<typeof connect>>) => {
    socket.ev.on("messages.upsert", ({ messages }) => {
        // debug message
        console.log(">>>> debug", JSON.stringify(messages,null,2))
        const message = mapperMessage(messages as proto.IWebMessageInfo[])
        if(!message.isFromMe){
            setTimeout(() => {
                onMessagesUpsert({ socket, message });
            }, TIMEOUT_IN_MILLISECONDS_BY_EVENT);
        }
    });
};