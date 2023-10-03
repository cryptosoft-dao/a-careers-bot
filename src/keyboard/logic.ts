/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    InlineKeyboardButton,
    InlineKeyboardMarkup
} from 'node-telegram-bot-api'

import { FUNC_BACK_WALLET, FUNC_CHECK, FUNC_PAY, FUNC_WALLET, FUNC_WIS, FUNC_WIS_TON, FUNC_WIS_TON_MAX, FUNC_WIS_TON_СONFIRM, FUNC_WIS_TYPE } from '../consts'
import { Text } from '../text/logic'

const btnWallet: InlineKeyboardButton = {
    text: 'Кошелек',
    callback_data: FUNC_WALLET
}
const btnCheck: InlineKeyboardButton = {
    text: 'Чеки',
    callback_data: FUNC_CHECK
}
const btnPay: InlineKeyboardButton = {
    text: 'Пополнить',
    callback_data: FUNC_PAY
}
const btnWis: InlineKeyboardButton = {
    text: 'Вывести',
    callback_data: FUNC_WIS
}

const btnBackWalletPayFromNotif: InlineKeyboardButton = {
    text: 'Кошелек',
    callback_data: FUNC_WALLET
}

const btnWisTonNotConfirm: InlineKeyboardButton = {
    text: 'Отменить',
    callback_data: FUNC_WALLET
}

function generatedBtnConfirm (func: string) {
    return {
        text: 'Подтвердить',
        callback_data: func
    } as InlineKeyboardButton
}

function back (func: string) {
    const key: InlineKeyboardButton = {
        text: '< Назад',
        callback_data: func
    }
    return key
}

function generatedCoinsKey (balance: any) {
    const keyboard = []
    let counter = 0
    let keyboardList = []
    const arrays = Object.keys(balance)
    for (let i = 0; i < arrays.length; i++) {
        if (counter === 0 && keyboard.length > 0) {
            keyboard.push(keyboardList)
            keyboardList = []
        }
        keyboardList.push({
            text: arrays[i].toUpperCase(),
            callback_data: FUNC_WIS_TYPE + arrays[i]
        } as InlineKeyboardButton)
        counter++
        if (counter === 3) {
            counter = 0
        }
        if (i > 8) {
            continue
        }
    }
    if (keyboardList.length > 0) {
        keyboard.push(keyboardList)
    }
    keyboard.push(
        [ back(FUNC_WALLET) ]
    )
    // console.log(keyboard)
    return keyboard
}

function GenerateKeyboardMax (balance: any) {
    const key: InlineKeyboardButton = {
        text: 'Max ' + Text.nanoToFloat(balance.ton) + ' TON',
        callback_data: FUNC_WIS_TON_MAX
    }
    return key
}

export class Keyboard {
    private static wrap (args: [... any]) {
        return { inline_keyboard: args }
    }

    public static getGlobal (): InlineKeyboardMarkup {
        const keyboard: InlineKeyboardMarkup = Keyboard.wrap(
            [
                [ btnWallet ],
                [ btnCheck ]
            ]
        )
        return keyboard
    }

    public static getWallet (): InlineKeyboardMarkup {
        const keyboard: InlineKeyboardMarkup = Keyboard.wrap(
            [
                [ btnPay, btnWis ],
                [ back(FUNC_BACK_WALLET) ]
            ]
        )
        return keyboard
    }

    public static getWalletPay (): InlineKeyboardMarkup {
        const keyboard: InlineKeyboardMarkup = Keyboard.wrap(
            [
                [ back(FUNC_WALLET) ]
            ]
        )
        return keyboard
    }

    public static getWalletPayFromNotif (): InlineKeyboardMarkup {
        const keyboard: InlineKeyboardMarkup = Keyboard.wrap(
            [
                [ btnBackWalletPayFromNotif ]
            ]
        )
        return keyboard
    }

    public static getWisCur (balance: any): InlineKeyboardMarkup {
        const keyboard: InlineKeyboardMarkup = Keyboard.wrap(
            generatedCoinsKey(balance)
        )
        return keyboard
    }

    public static getWisCurTon (balance: any, err: boolean = true): InlineKeyboardMarkup {
        const key = balance.ton < 0 ? [
            [ back(FUNC_WIS) ]
        ] : [
            [ GenerateKeyboardMax(balance) ],
            [ back(FUNC_WIS) ]
        ]
        const keyboard: InlineKeyboardMarkup = Keyboard.wrap(
            key
        )
        return keyboard
    }

    public static getWisCurTonAddress (): InlineKeyboardMarkup {
        const keyboard: InlineKeyboardMarkup = Keyboard.wrap(
            [
                [ back(FUNC_WIS_TON) ]
            ]
        )
        return keyboard
    }

    public static getWisCurTonConfirm (): InlineKeyboardMarkup {
        const keyboard: InlineKeyboardMarkup = Keyboard.wrap(
            [
                [ btnWisTonNotConfirm, generatedBtnConfirm(FUNC_WIS_TON_СONFIRM) ]
            ]
        )
        return keyboard
    }
}
