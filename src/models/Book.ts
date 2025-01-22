import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { ReadingProgress } from "./ReadingProgress";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    author: string;

    @Column({ nullable: true })
    isbn: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    coverUrl: string;

    @Column({ default: 0 })
    totalPages: number;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @ManyToOne(() => User, user => user.books)
    user: User;

    @OneToMany(() => ReadingProgress, progress => progress.book)
    readingProgress: ReadingProgress[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}