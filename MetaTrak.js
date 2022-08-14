import axios from "axios";
import Auth from "./Auth.js";
import xml2js from "xml2js";

const MetaTrak = {
    loginUrl: 'https://metatrak.it/v1_5/sf/Login.aspx',
    eventsUrl: 'https://metatrak.it/v1_5/af/EventsGet.aspx',
    logoutUrl: 'https://metatrak.it/v1_5/sf/logout.aspx',

    async login(login, password) {
        const params = new URLSearchParams({
            applicationkey: '82581d79c699',
            version: '1.5.8',
            login,
            password,
            locale: 'en_GB',
        });

        const res = await axios.get(this.loginUrl + '?' + params.toString());

        const obj = await xml2js.parseStringPromise(res.data, { explicitArray: false });

        return Auth.fromResponse(obj);
    },

    async events(session, since, imei) {
        const params = new URLSearchParams({
            sessionid: session.sessionId,
            imei,
            datestart: since,
            dateend: Math.round((new Date()).getTime() / 1000),
            locale: 'en_GB',
        });

        const res = await axios.get(this.eventsUrl + '?' + params.toString());

        const obj = await xml2js.parseStringPromise(res.data, { explicitArray: false });

        if (Array.isArray(obj.root.events.event)) {
            return obj.root.events.event;
        }

        if (obj.root.events.event !== undefined) {
            return [obj.root.events.event];
        }

        return [];
    },

    async logout(session) {
        const params = new URLSearchParams({
            sessionid: session.sessionId,
            adminsessionid: session.sessionId,
            locale: 'en_GB',
        });

        await axios.get(this.logoutUrl + '?' + params.toString());
    },
}

export default MetaTrak;
