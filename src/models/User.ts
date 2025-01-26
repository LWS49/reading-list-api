import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { ReadingProgress } from "./ReadingProgress";
import { Book } from "./Book";

@Entity() 
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Book, (book) => book.user)
    books: Book[];

    @OneToMany(() => ReadingProgress, (progress) => progress.user)
    readingProgress: ReadingProgress[];
}