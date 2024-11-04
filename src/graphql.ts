
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateAuthorInput {
    name: string;
}

export class Author {
    id: number;
    name?: Nullable<string>;
}

export class Book {
    id: number;
    title?: Nullable<string>;
}

export abstract class IQuery {
    abstract author(id: number): Nullable<Author> | Promise<Nullable<Author>>;

    abstract book(id: number): Nullable<Book> | Promise<Nullable<Book>>;
}

export abstract class IMutation {
    abstract addAuthor(input?: Nullable<CreateAuthorInput>): Author | Promise<Author>;
}

type Nullable<T> = T | null;
