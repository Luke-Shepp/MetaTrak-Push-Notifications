class Auth {
    constructor (userId, sessionId, server, serverUrl) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.server = server;
        this.serverUrl = serverUrl;
    }

    static fromResponse(response) {
        return new Auth(response.root.userid, response.root.sessionid, response.root.server, response.root.serverurl);
    }
}

export default Auth;
