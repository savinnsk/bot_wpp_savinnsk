export const onMessagesUpsert =  async ({ socket, messages }) => {
    if (!messages.length) {
        return;
    }


    socket.sendMessage(messages[0].key.remoteJid , {text:"test",
        force: false,
        delete: false})

    
};

