import { Client } from "discord.js";
import { Commands } from "../Commands";
import { LavalinkManager } from "lavalink-client/dist/types";

export default (client: Client, lavalink: LavalinkManager): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        
        await client.application.commands.set(Commands);

        console.log(`${client.user.username} is online`);

        const serverCount = Number.parseFloat(String(client.guilds.cache.size)).toLocaleString("en-US");
        const channelCount = Number.parseFloat(String(client.channels.cache.size)).toLocaleString("en-US");
        const userCount = Number.parseFloat(String(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))).toLocaleString("en-US");
    
        const statuses = [
          { "name": `${serverCount} servers & ${userCount} users and ${channelCount} channels`, "type": 3 },
          { "name": "\/play", "type": 2 },
          { "name": "\/help", "type": 0 }
        ];
    
        setInterval(() => {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          client.user?.setActivity(status.name, { type: status.type });
        }, 60000);

        await lavalink.init({ ...client.user! }); 
    });
};