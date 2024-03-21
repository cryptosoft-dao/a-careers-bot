import dotenv from "dotenv";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import TelegramBot from "node-telegram-bot-api";

dotenv.config({});

import { ShowTaskButton } from "./buttons/taskStatus";
import taskNotification from "./notifications/taskStatus";

import ITask from "./interfaces/Task";

const port = 8080;
const app: Express = express();
const token = process.env.BOT_TOKEN || "";
const bot = new TelegramBot(token, { polling: false });

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.post("/task-notification", async (req: Request, res: Response) => {
  const task: ITask = req.body;
  const notificationText = taskNotification({
    status:task.order.status,
    title: task.order?.name || "",
    category: task.order?.category || "",
    responses: task.order?.responsesCount || 0,
  });
  const notificationBtns = ShowTaskButton(task.order.status);

  let chatIds = (await bot.getUpdates()).map((update) => {
    return update.message?.chat.id;
  });
  // Extract unique chat IDs from updates
  chatIds = [...new Set(chatIds)];
  // Send message to each chat ID
  chatIds.forEach((chatId) => {
    if (!chatId) return;
    bot
      .sendMessage(chatId, notificationText, {
        parse_mode: "HTML",
        reply_markup: notificationBtns,
      })
      .catch((error) => console.log(`Error sending message ${error}`));
  });

  res.send("ok");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running on ${port}`);
});
