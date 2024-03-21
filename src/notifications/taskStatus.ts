const STATUS = {
  moderation: 0,
  active: 1,
  waiting_freelancer: 2,
  in_progress: 3,
  fulfilled: 4,
  refunded: 5,
  completed: 6,
  payment_forced: 7,
  pre_arbitration: 8,
  on_arbitration: 9,
  arbitration_solved: 10,
  outdated: 11,
};

const taskOnmoderation = (title: string) => {
  return `The task ${title} has been sent for moderation`;
};

const taskPublished = (title: string) => {
  return `The task ${title} was moderated and published on the service`;
};

const taskNewResponse = (title: string, responses: number) => {
  return `A new response to the task ${title} has arrived. You have ${responses} responses.`;
};

const taskNew = (category: string, title: string) => {
  return `New task in the "${category}" category - ${title}`;
};

const taskResponseSent = (title: string) => {
  return `You have sent a response to the task "${title}". Wait for the customer's response.`;
};

const taskRejected = (title:string) => {
  return `The task "${title}" was rejected.`
}

export default function taskNotification(task: {
  status: number;
  title: string;
  responses: number;
  category: string;
}) {
  let message = "No Notification found for given status";
  switch (task.status) {
    case STATUS.moderation:
      message = taskOnmoderation(task.title);
      break;
    case STATUS.active:
      message = taskPublished(task.title);
      break;
    case STATUS.waiting_freelancer:
      message = taskNewResponse(task.title, task.responses);
      break;
  }
  return message;
}
