import { TIMEOUT_IN_MILLISECONDS_BY_EVENT } from "./config.ts";
import { onMessagesUpsert } from "./middlewares/onMessagesUpsert.ts";

export const load = (socket) => {
    socket.ev.on("messages.upsert", ({ messages }) => {
        setTimeout(() => {
            onMessagesUpsert({ socket, messages });
        }, TIMEOUT_IN_MILLISECONDS_BY_EVENT);
    });
};