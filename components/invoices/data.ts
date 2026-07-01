import type { Invoice } from "./types";

export const INVOICES: Invoice[] = [
  { id: "INV-001", subject: "Designing",        clientName: "Jhon Deo", amount: "Rs. 50,000", issueDate: "01 Jan 2026", dueDate: "15 Jan 2026", status: "Paid"    },
  { id: "INV-002", subject: "Web Development",  clientName: "Jhon Deo", amount: "Rs. 50,000", issueDate: "01 Jan 2026", dueDate: "15 Jan 2026", status: "Pending" },
  { id: "INV-003", subject: "Content Writer",   clientName: "Jhon Deo", amount: "Rs. 50,000", issueDate: "01 Jan 2026", dueDate: "15 Jan 2026", status: "Paid"    },
  { id: "INV-004", subject: "Digital Marketing",clientName: "Jhon Deo", amount: "Rs. 50,000", issueDate: "01 Jan 2026", dueDate: "15 Jan 2026", status: "Overdue" },
  { id: "INV-005", subject: "SEO Optimization", clientName: "Jhon Deo", amount: "Rs. 50,000", issueDate: "01 Jan 2026", dueDate: "15 Jan 2026", status: "Pending" },
  { id: "INV-006", subject: "App Development",  clientName: "Sara Lee",  amount: "Rs. 75,000", issueDate: "05 Jan 2026", dueDate: "20 Jan 2026", status: "Paid"    },
  { id: "INV-007", subject: "UI/UX Design",     clientName: "Sara Lee",  amount: "Rs. 30,000", issueDate: "08 Jan 2026", dueDate: "22 Jan 2026", status: "Pending" },
  { id: "INV-008", subject: "Social Media",     clientName: "Alex Roy",  amount: "Rs. 20,000", issueDate: "10 Jan 2026", dueDate: "25 Jan 2026", status: "Overdue" },
  { id: "INV-009", subject: "E-commerce Setup", clientName: "Alex Roy",  amount: "Rs. 90,000", issueDate: "12 Jan 2026", dueDate: "27 Jan 2026", status: "Paid"    },
  { id: "INV-010", subject: "Brand Identity",   clientName: "Mia Chan",  amount: "Rs. 45,000", issueDate: "15 Jan 2026", dueDate: "30 Jan 2026", status: "Pending" },
];
