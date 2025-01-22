import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity()
export class ReadingProgress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pagesRead: number;

    @Column({ type: 'timestamp' })
    readingDate: Date;

    @Column({ nullable: true })
    timeSpentMinutes: number;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @ManyToOne(() => User, user => user.readingProgress)
    user: User;

    /*
    () => User: Specifies the target entity for the relationship (in this case, User).
    user => user.readingProgress: Establishes how the target entity relates back to the current entity. 
    Specifically, it references the readingProgress property in the User entity,
    indicating a bidirectional relationship.
    */

    @ManyToOne(() => Book, book => book.readingProgress)
    book: Book;

    @CreateDateColumn()
    createdAt: Date;
}