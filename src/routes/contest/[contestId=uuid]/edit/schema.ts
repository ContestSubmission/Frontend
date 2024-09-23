import { z } from "zod";
import { ViewMode } from "$lib/components/grade/grade";

export function formSchema(withDeadline: boolean) {
    const shape = {
        name: z.string().min(3).max(50),
        description: z.string().max(50).nullable(),
        maxTeamSize: z.number().int().min(1).max(50).nullable(),
        publicAccessible: z.boolean().nullable(),
        publicGrading: z.boolean().nullable(),
        defaultViewMode: z.nativeEnum(ViewMode).nullable()
    };
    if (withDeadline) {
        shape.deadline = z.date()
            .min(new Date(), "Date must be in the future")
            .nullable()
    }
    return z.object(shape);
}

export type FormSchema = typeof formSchema;
