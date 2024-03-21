export default interface ITask {
  id: number;
  orderId: number;
  order: {
    index: number;
    address: string;
    status: number;
    customerAddress: string;
    customer: string | null;
    freelancerAddress: string | null;
    freelancer: string | null;
    createdAt: string;
    responsesCount: number;
    category: string;
    language: string;
    name: string;
    price: number;
    deadline: string;
    description: string;
    technicalTask: string;
    nameTranslated: string;
    descriptionTranslated: string | null;
    technicalTaskTranslated: string | null;
  };
  txLt: number;
  txHash: string;
  timestamp: string;
  opCode: number;
  senderRole: number;
  senderAddress: string;
  sender: string | null;
  amount: number;
}
