exports.handler = async (event) => {
    const payload = {
        date: new Date(),
        message: 'Hello Lambda !'
    };
    return JSON.stringify(payload);
};