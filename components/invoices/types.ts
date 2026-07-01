export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export interface Invoice {
  id: string;
  subject: string;
  clientName: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}
