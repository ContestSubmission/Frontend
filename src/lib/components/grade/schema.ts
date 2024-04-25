import { z } from "zod";

export const formSchema = z.object({
    grade: z.number().min(0).max(100),
    comment: z.string().nullable()
});
export type FormSchema = typeof formSchema;
