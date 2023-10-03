import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import TelegramBot, { InlineKeyboardMarkup, SendMessageOptions } from 'node-telegram-bot-api'

const dataTg: SendMessageOptions = { parse_mode: 'HTML', reply_markup: {
    inline_keyboard: [ 
        [ {text: 'SomeDao', web_app: {url: 'https://freelance-exchange-frontend.pages.dev/' } }]
    ] 
}}

const token = '6640543460:AAGDNECHoP2xT7tx9gSLdmaR_VX_eVEMXMA'
const bot = new TelegramBot(token, { polling: true })

const port = 8080

const app: Express = express()
app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded()) // to support URL-encoded bodies
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send('ok')
})

bot.on('message', async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id
    const username = msg.chat.username

    const userText = msg.text

    bot.sendMessage(chatId, 'Hi, this is a delab bot, here you can run our applications.', dataTg)
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
