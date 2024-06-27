## A LIBRARY MANAGEMENT SYSTEM API:

- Built with NestJS, TypeORM
- SQLite database for fast on-app db connection
- nodemailer: with notifications service sending mail to customer
- using authGuard: guarding api endpoints with jwt
- seeders: auto generate data seeds using typeorm_seeding lib (cmd: npm run seed:run)
- interceptors: re-format response for better look
- cronjob: daily checking for some features, combine with nodemailer to automatically send notifications to users

# api/v1

# /admins

    POST: /add - Add new admin to system
    GET: / - Get all admins
    GET: /:id - Get admin by {id}
    PATCH: /:id - Update admin by {id}
    DELETE: /:id - Delete admin by {id}

# /auth

    POST: /login - Admin login system, generating jwt tokens (access_token for authenticate, refresh_token saved in HTTP Only Cookie) {body: {username, password}}
    POST: /refresh - Generating new jwt tokens for authenticate (require refresh_token saved in Cookie)

# /authors

    CRUD features for authors table

# /books

    CRUD features for books table

    GET: /search? - search books by title/author/category/availability

# /categories

    CRUD features for categories table

# /customers

    CRUD features for customers table

# /fine

    CRUD features for fine table

    POST: /calculate/:transaction_id - calculate fine details for transaction by {id}
    POST: /pay/:fine_id - for customer to pay their fines which calculated by the method above

# /reservations

    CRUD features for reservations table

    POST: /create - create new book reservation for customer {body: {book_id, customer_id}}
    DELETE: /cancel/:id - cancel book reservation by {reservation_id}
    PATCH: /fulfill/:id - update book reservation to be fulfilled (Book borrowed by user - Update data to transactions table)

# /scheduler

    Cron job for reservations and transactions checking (EVERY_DAY_AT_7AM)

    - Check the transactions table if the book is returned before due_date (overdue), if not, send mail notification to customer with fine information
    - Check the reservation table if the book is fulfilled (borrowed) before expiration, if not, send mail notification to customer

      POST: /start - start the cron job
      POST: /stop - stop the cron job

# /transactions

    CRUD features for transactions table

    POST: /issue - for customer to request a book issuance {body: {book_id, customer_id}}
    POST: /return/:id - for customer to request a book return by {transaction_id}
