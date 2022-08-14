import PushBullet from "pushbullet";
import Auth from "./Auth.js";
import MetaTrak from "./MetaTrak.js";

export const handler = async (event) => {
    const pusher = new PushBullet(process.env.PB_API_KEY);

    const session = await MetaTrak.login(process.env.LOGIN, process.env.PASSWORD);

    const events = await MetaTrak.events(session, Math.round((new Date()).getTime() / 1000) - (60 * 5), process.env.IMEI);

    events.forEach(event => {
        const desc = `MetaTrak: "${event.name}" at: "${event.time}"`;

        console.log(desc);

        pusher.note({}, event.name, desc);
    });

    await MetaTrak.logout(session);

    return 'ok: ' + events.length;
};
