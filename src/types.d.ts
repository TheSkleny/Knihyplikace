/**
 * Type definitions for the whole project
 */

type Book = {
    Id: string;
    Name: string;
    Author: string;
    PublishDate: string;
    Publisher: string;
    Language: string;
    Pages: number;
    PagesRead: number;
    Rating: number;
    Description: string;
    GenreId: string;
    IsOwned: boolean;
    CoverImageLink: string;
    LastPageUpdate: string;
}

type BookList = {
    Id: string;
    Name: string;
    Books: Book[];
}

type BookInBookList = {
    Id: string;
    BookId: string;
    ListId: string;

}

type Genre = {
    Id: string;
    Name: string;
}

type Achievement = {
    Id: string;
    Name: string;
    Description: string;
    Reward: number;
    Goal: number;
    Current: number;
    ImageUri: string;
}

type Gift = {
    GiftId: string;
    Person: string;
    BookId: string;
    Name: string;
    Author: string;
    CoverImageLink: string;
}