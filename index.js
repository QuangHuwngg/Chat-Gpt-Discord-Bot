const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();
const collection = new Map();
const config = require('./config.json');
require('colors');

// Đang khởi tạo ứng dụng khách
const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
    allowedMentions:{
        repliedUser: false,
        parse: ['users','roles','everyone']
    },
    presence: {
        // Các hoạt động
        activities: [{name: `Đang Chơi Game`, type: 4}],
        status: "online"
    },
});

// Sự cố - Phòng ngừa
process.on('unhandledRejection', async (err, cause) => {
    console.log(`[Uncaught Rejection]: ${err}`.bold.red);
    console.log(cause);
});

process.on('uncaughtException', async err => {
    console.log(`[Uncaught Exception] ${err}`.bold.red);
});

client.on('ready', async client => {
    const stringlength = 69;
    console.log(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.magenta)
    console.log(`┃ `.magenta+ " ".repeat(-1+(stringlength-` ┃ `.length-`[Events] ${client.user.tag} is online!`.length)/2) + `[Events] ${client.user.tag} is online!`.green.bold + " ".repeat((stringlength-` ┃ `.length-`[Events] ${client.user.tag} is online!`.length)/2)+ "┃".magenta)
    console.log(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.magenta);
});

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

let prompt = [
    {"role": "system", "content": `I'm BotGPT, created by Nguyen Quang Hung`},
];// Bạn có thể sửa đổi lời nhắc để có phản hồi tùy chỉnh

client.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.guild.available) await message.guild.fetch().catch(e => null);
    
    if(!config.channels.includes(message.channel.id)) return;

    try{
        collection.forEach((value, key) => {
            let l = value[value.length - 1];
	        if(!l || !Array.isArray(l) || !l[0]) return collection.delete(key);
            if(Date.now() - l[0] >= 60*1000) collection.delete(key)
        });

        if(!message.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) return;
        if(message.type != 0 || ![0 , 5, 10, 11, 12].includes(message.channel.type)) return; // Bỏ qua câu trả lời

        message.channel.sendTyping().catch(e => {null}); // Bot đang nhập ...

        if(!collection.has(message.author.id)){
            collection.set(message.author.id, []);
        }

        let userm = collection.get(message.author.id);
        if(!userm || !Array.isArray(userm)) userm = [];
	    userm = userm.filter(d => d && d[0]);
        userm = userm.filter(d => 60*1000 - (Date.now() - d[0]) >= 0);

        // Giới thiệu người dùng (bỏ phần này nếu muốn)
        let prev = [
            {'role':'user', 'content':`Hi! My name is ${message.member.displayName}`},
            {'role':'assistant', 'content': `Nice to meet you ${message.member.displayName}!`}
        ];

        // Đang tải các cuộc trò chuyện trước đó
        await userm.forEach(async d => {
            let userline = [d[1]];
            let botline = userline.concat([d[2]]);
            prev = prev.concat(botline);
        });

        let b = prompt.concat(prev).concat([{"role":"user", "content": message.cleanContent}]);
        // console.log(b); // Để gỡ lỗi

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        var err = false;
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: b,
            temperature: 0.9,
            max_tokens: 1500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
        }).catch(async e => {
            console.log(`${e}`.red);
            err = true;
	        await message.channel.send({content: `[OpenAI Error]`.concat(e)});
        });

        if(err || !Array.isArray(response.data.choices)) return;
        
        let reply = response.data.choices[0]?.message?.content;

        message.reply({content: reply, allowedMentions: {repliedUser: false}})
        .catch(async e => {
            err = true
            console.log(e)
        });

        if(err) return;
        
        userm.push([Date.now(), {"role":"user", "content": message.cleanContent}, {"role":"assistant", "content": reply}]);
        collection.set(message.author.id, userm);
        // console.log({"User": message.cleanContent});  // Tin nhắn của người dùng
        // console.log({"AI": reply});                   // Tin nhắn của AI
        
        return;
    } catch(e){
        console.log(`[AI-Chat] ${e}`.red);
    }
});

// Đăng nhập Discord
client.login(process.env.token);
