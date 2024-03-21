export const ShowTaskButton = (order: number) => ({
  inline_keyboard: [
    [
      {
        text: "Show Task",
        web_app: { url: `${process.env.WEBAPP_URL || ""}/en/tasks/${order}` },
      },
    ],
  ],
});
