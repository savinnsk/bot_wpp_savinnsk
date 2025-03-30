exports.onMessagesUpsert =  async ({ socket, messages }) => {
    if (!messages.length) {
        return;
    }

    const webMessage = messages(0);
    const commomFunctions = loadCommomFunctions({ socket, webMessage });

    await dynamicCommand(commomFunctions);
    
};

