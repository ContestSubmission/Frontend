import { z } from "zod";

export const formSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().max(50).nullable(),
    deadline: z.date()
        .min(new Date(), "Date must be in the future"),
    maxTeamSize: z.number().int().min(1).max(50).default(1),
    publicAccessible: z.boolean().default(true),
    publicGrading: z.boolean().default(true)
});

export type FormSchema = typeof formSchema;
