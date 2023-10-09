import cors from 'cors'
import { DB, User } from './db'
import { MySql } from './db/connect'
import express, { Express, Request, Response } from 'express'
import TelegramBot, { EditMessageTextOptions, InlineKeyboardMarkup, SendMessageOptions } from 'node-telegram-bot-api'
import { Address } from 'ton-core'

const dataTg = {
    inline_keyboard: [ 
        [ {text: 'SomeDao', web_app: {url: 'https://freelance-exchange-frontend.pages.dev/' } }],
        [ {text: 'Add/Edit your address', callback_data: 'add_address'} ]
    ] 
}

const dataTg2 = {
    inline_keyboard: [
        [ {text: 'Оплатить 10 TON', url: 'https://t.me/CryptoBot?start=IVzE0Sy5BFIg'} ]
    ] 
}

const keyboardAddAddress = {inline_keyboard: [
    [ {text: 'Back', callback_data: 'main'} ]
] }



const port = 8080

const app: Express = express()
app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded()) // to support URL-encoded bodies
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('ok')
})

async function registerUserInDb (pool: DB, username: string | undefined, id_telegram: number) {
    // const wallet = new CustomWallet().newWallet()
    const res = await pool.getUser(id_telegram)

    if (res === undefined) {
        await pool.addUser({
            id: 0,
            username,
            id_telegram,
            address: '',
        } as User)

        const res2 = await pool.getUser(id_telegram)
        console.log(res2)
        return res2
    }
    // console.log(res)
    return res
}

async function registerUserInDb2 (pool: DB, username: string | undefined, id_telegram: number) {
    // const wallet = new CustomWallet().newWallet()
    const res = await pool.getUser2(id_telegram)

    if (res === undefined) {
        await pool.addUser2({
            id: 0,
            username,
            id_telegram,
            address: '',
        } as User)

        const res2 = await pool.getUser2(id_telegram)
        console.log(res2)
        return res2
    }
    // console.log(res)
    return res
}

async function startBot() {
    const connect = await new MySql().sync()

    const db = new DB(connect.pool)

    const token = '6640543460:AAGDNECHoP2xT7tx9gSLdmaR_VX_eVEMXMA'
    const bot = new TelegramBot(token, { polling: true })

    bot.on('message', async (msg: TelegramBot.Message) => {
        const chatId = msg.chat.id
        const username = msg.chat.username
    
        const userText = msg.text

        await registerUserInDb(db, username, chatId)

        try {
            const addr = Address.parse(userText ?? '')

            await db.updateUserAddress(chatId, addr.toString())

            bot.sendMessage(chatId, 'Address update', { 
                parse_mode: 'HTML',
                reply_markup: dataTg
            })

        } catch (error) {
            bot.sendMessage(chatId, 'Hi, this is a Some DAO bot, here you can run our applications.', { 
                parse_mode: 'HTML',
                reply_markup: dataTg
            })
        }
    })

    bot.on('callback_query', async (callbackQuery) => {
        const action = callbackQuery.data
        const msg = callbackQuery.message
        if (!msg) {
            console.log('error')
            return
        }
        const username = msg.chat.username
        const chatId = msg.chat.id

        const UserDb = await registerUserInDb(db, username, chatId)

        let text = ''
        const opts: EditMessageTextOptions = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            reply_markup: dataTg,
            parse_mode: 'HTML'
        }

        if (action === 'add_address') {
            text = 'Send your address TON to receive notifications'
            if (UserDb.address !== '' || UserDb.address) {
                text = text + '\n\nYour address: ' + UserDb.address
            }
            opts.reply_markup = keyboardAddAddress
        }

        if (action === 'main') {
            text = 'Main menu'
        }

        bot.editMessageText(text, opts)
    })
}

async function startBotTest () {
    const connect = await new MySql().sync()

    const db = new DB(connect.pool)

    const token = '5898239617:AAHJAYyRptVSVNQqX9rlX49ZCxu1iBa3H-E'
    const bot = new TelegramBot(token, { polling: true })

    bot.on('message', async (msg: TelegramBot.Message) => {
        const chatId = msg.chat.id
        const username = msg.chat.username
    
        const userText = msg.text

        const commands = userText?.split(' ')

        await registerUserInDb2(db, username, chatId)

        if (commands && (username === 'some_wallet' || username === 'sijuz') && commands.length > 0 && commands[0] === '/send') {
            const users = await db.getAllUsers2()
            for (let i=0; i<users.length;i++) {
                bot.sendMessage(users[i].id_telegram, userText?.replace('/send ', '') ?? '', { 
                    parse_mode: 'HTML'
                })
            }

            bot.sendMessage(chatId, 'Рассылка успешно отправлена на ' + users.length + ' пользователей', { 
                parse_mode: 'HTML'
            })
        } else if (commands && (username === 'some_wallet' || username === 'sijuz') && commands.length > 0 && commands[0] === '/users') {
            const users = await db.getAllUsers2()

            let text = "Все пользльзователи("+users.length+"):\n\n"

            for (let i=0; i<users.length;i++) {
                text = text + '#' + users[i].id_telegram + ' @' +  users[i].username + '\n'
                
            }

            bot.sendMessage(chatId, text, { 
                parse_mode: 'HTML'
            })
        } else {

    
            bot.sendMessage(chatId, 'Привет это бот для оплаты', { 
                parse_mode: 'HTML',
                reply_markup: dataTg2
            })
        }
        
    })
}



app.listen(port, () => {

    startBot()
    startBotTest()
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
