import { z } from "zod";

// const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB

export const formSchema = z.object({
    file: z.any()
    // TODO: add checks once formsnap has superforms v2 support
    // see https://github.com/huntabyte/formsnap/issues/115
    /*
        .refine((file) => {
            return true;
        }, `Max file size is 100 MB.`)
        .refine(
            (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            `Only ${ACCEPTED_FILE_TYPES.join(", ")} files are accepted.`
        ),
    */
});
export type FormSchema = typeof formSchema;
