export const transactionData = [
  {
    book_id: 1,
    customer_id: 1,
    issued_date: new Date(),
    due_date: new Date(new Date().setDate(new Date().getDate() + 14)),
  },
  {
    book_id: 1,
    customer_id: 2,
    issued_date: new Date(2024, 5, 14),
    due_date: new Date(2024, 5, 21),
  },
  {
    book_id: 4,
    customer_id: 3,
    issued_date: new Date(),
    due_date: new Date(new Date().setDate(new Date().getDate() + 14)),
  },
  {
    book_id: 2,
    customer_id: 3,
    issued_date: new Date(2024, 5, 12),
    due_date: new Date(2024, 5, 19),
  },
];
