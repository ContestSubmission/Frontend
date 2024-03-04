import { z } from "zod";

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB

export const formSchema = z.object({
    file: z
        .instanceof(File, { message: "Please upload a file!" })
        .refine(file => file.size < MAX_FILE_SIZE, "Too large! Max file size is 100 MB.")
});

export type FormSchema = typeof formSchema;
