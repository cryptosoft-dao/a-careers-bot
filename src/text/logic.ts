/* eslint-disable @typescript-eslint/explicit-module-boundary-types */


import { FEE_TON } from '../consts'

const TEXT_START = `<b>DeLab bot</b> - криптовалютный бот кошелек\n\n
Храни, отправляй и получай криптовалюту здесь. Кошелёк всегда доступен в Telegram!`
const TEXT_WALLET_1 = '💵 <b>Ваш баланс</b>'

const TEXT_PAY_1 = '📥 <b>Пополнение</b>\n\nИспользуйте этот адрес для перевода <b>TON</b>:\n\n<code>'

const TEXT_POPOL = '💵 <b>Вы внесли</b> на счёт <b>'

const TEXT_WIS = '📥 <b>Вывод</b>\n'
const TEXT_WIS_1 = '<b>Выберите валюту вывода:</b>'

const TEXT_WIS_ERR = '\n\n🔺 <b>У Вас на балансе недостаточно средств для вывода.</b>'

const TEXT_WIS_SUSS = '\n\n <b>Введите сумму для вывода</b>'

export interface UserType {
    id: number,
    username: string,
    id_telegram: number,
    balance: {
        ton: string | bigint,
        aboba: string | bigint
    },
    address: string
}

export class Text {
    private user: UserType

    constructor (user: UserType) {
        this.user = user
    }

    public fetch (user: UserType): void {
        this.user = user
    }

    public static nanoToFloat (num: string | bigint): string {
        let res = (Number(num) / 10 ** 9).toFixed(6)
        if (res[res.length - 1] === '0') {
            res = (Number(num) / 10 ** 9).toFixed(5)
        }
        if (res[res.length - 1] === '0') {
            res = (Number(num) / 10 ** 9).toFixed(4)
        }
        if (res[res.length - 1] === '0') {
            res = (Number(num) / 10 ** 9).toFixed(3)
        }
        if (res[res.length - 1] === '0') {
            res = (Number(num) / 10 ** 9).toFixed(2)
        }
        if (res[res.length - 1] === '0') {
            res = (Number(num) / 10 ** 9).toFixed(1)
        }
        if (res[res.length - 1] === '0') {
            res = (Number(num) / 10 ** 9).toFixed(0)
        }
        return res
    }

    public static getStart (): string {
        return TEXT_START
    }

    public getWallet (): string {
        const text = `${TEXT_WALLET_1}\n<i>
TON: <code>${Text.nanoToFloat(this.user.balance.ton)}</code>\n
ABOB: <code>${this.user.balance.aboba}</code></i>`
        return text
    }

    public getPay (): string {
        return TEXT_PAY_1 + this.user.address + '</code>'
    }

    public static getPopol (amount: string, name_coin: string): string {
        return TEXT_POPOL + amount + ' ' + name_coin.toUpperCase() + '</b>.'
    }

    public getWis (): string {
        const text = `${TEXT_WIS}<i>
TON: <code>${Text.nanoToFloat(this.user.balance.ton)}</code>
ABOB: <code>${this.user.balance.aboba}</code></i>\n\n${TEXT_WIS_1}`
        return text
    }

    public getWisTon (balance: any): string {
        const err = BigInt(balance.ton) < 0 ? TEXT_WIS_ERR : TEXT_WIS_SUSS
        const text = `${TEXT_WIS}
Баланс: <code>${Text.nanoToFloat(this.user.balance.ton)} TON</code>

Минимум: <code>0.000000001 TON</code>
Комиссия: <code>0.05 TON</code>${err}`
        return text
    }

    public static getWisAddress (coin: string): string {
        const text = `Пришлите адрес кошелька для отправки ${coin.toUpperCase()}.`
        return text
    }

    public static getConfirmAmountTon (amount: string, address: string): string {
        const text = `<b>Проверка и подтверждение</b>

<b>Адрес:</b><code>${address}</code>
<b>Отправляете:</b><code>${Text.nanoToFloat(BigInt(amount))}</code>
<b>Комиссия:</b><code>0.05</code>

<b>Общая сумма:</b><code>${Text.nanoToFloat(BigInt(amount) + FEE_TON)}</code>

Вы уверены, что хотите отправить эти монеты?
`
        return text
    }

    public static addWis (): string {
        const text = '<b>Вывод средств поставлен в очередь.</b>'
        return text
    }

    public static wisSend (amount: string, coin: string): string {
        const text = `📥 <b>Вывод <code>${Text.nanoToFloat(amount)} ${coin.toUpperCase()}</code> отправлен.</b>`
        return text
    }
}
