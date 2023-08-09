export interface Author {
    id: number;
    name: string;
    description: string;
}

export interface Message {
    id: number;
    dateTime: string;
    authorId: number;
    text: string;
}