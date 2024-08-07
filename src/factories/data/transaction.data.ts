export const transactionData = [
  {
    book_id: 4,
    customer_id: 3,
    issued_date: new Date(),
    due_date: new Date(new Date().setDate(new Date().getDate() + 14)),
  },
  {
    book_id: 2,
    customer_id: 2,
    issued_date: new Date(2024, 5, 12),
    due_date: new Date(2024, 5, 19),
  },
  {
    book_id: 6,
    customer_id: 3,
    issued_date: new Date(2024, 5, 12),
    due_date: new Date(2024, 5, 17),
  },

  {
    book_id: 4,
    customer_id: 4,
    issued_date: new Date(2024, 5, 20),
    due_date: new Date(2024, 5, 27),
  },
  {
    book_id: 10,
    customer_id: 3,
    issued_date: new Date(2024, 6, 16),
    due_date: new Date(2024, 6, 17),
  },
];
