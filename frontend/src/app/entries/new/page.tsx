"use client"

/*
    Future: Improve the form! Learn more about useForm.
    use better error hanlding instead of alert.
*/

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CreateBookInput, createBookSchema } from "@/types/bookSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function NewEntryPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CreateBookInput>({
        resolver: zodResolver(createBookSchema), 
        defaultValues: {
            title: "",
            author: "",
            status: "unread",
            startedAt: undefined,
        } 
    });

    const onSubmit = async (values: CreateBookInput) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/books", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            if (!res.ok) {
                throw new Error("Failed to make new entry")
            }

            router.push("/entries");
            router.refresh();
        } catch (e) {
            console.log(e);
            alert("Something went wrong when submitting a new entry.")
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h1>New Book Entry</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Book title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="author"
                        render={({field}) => (
                        <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                                <Input placeholder="Author (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="unread">Unread</SelectItem>
                                        <SelectItem value="reading">Reading</SelectItem>
                                        <SelectItem value="finished">Finished</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="startedAt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Started At</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        value={field.value ?? ""}
                                        onChange={(e) => 
                                            field.onChange(
                                                e.target.value == "" ? undefined : e.target.value
                                            )
                                        } 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Creating..." : "create"}
                    </Button>

                </form>
            </Form>
        </div>
    )
}