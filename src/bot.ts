import cors from 'cors'
import { DB, User, User2 } from './db'
import { MySql } from './db/connect'
import express, { Express, Request, Response } from 'express'
import TelegramBot, { EditMessageTextOptions, InlineKeyboardMarkup, SendMessageOptions } from 'node-telegram-bot-api'
import { Address } from 'ton-core'
import axios from 'axios'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const dataTg = {
    inline_keyboard: [ 
        [ {text: 'SomeDao', web_app: {url: 'https://freelance-exchange-frontend.pages.dev/' } }],
        [ {text: 'Add/Edit your address', callback_data: 'add_address'} ]
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

app.post('/send', async (req: Request, res: Response) => {
    const name = req.body.name
    const username = req.body.username

    const token = '5898239617:AAHJAYyRptVSVNQqX9rlX49ZCxu1iBa3H-E'
    const bot = new TelegramBot(token, { polling: false })

    const connect = await new MySql().sync()

    const db = new DB(connect.pool)

    try {
        await db.addUser2({
            id: 0,
            username: username.replace('@', ''),
            id_telegram: 0,
            pay: 0,
            name_user: name
        } as User2)
    } catch (e) {
        
    }


    bot.sendMessage(232885094, `Новая заявка\n\nИмя: ${name}\n\nНик: ${username}` )
    bot.sendMessage(238211251, `Новая заявка\n\nИмя: ${name}\n\nНик: ${username}` )
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



app.listen(port, () => {

    startBot()
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
