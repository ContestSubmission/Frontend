import type { Contest } from "@contestsubmission/api-client";
import { buttonVariants } from "$lib/components/ui/button";
import type { VariantProps } from "tailwind-variants";

function addWeeksToDate(numberOfWeeks: number, dateObj: Date = new Date()) {
    dateObj.setDate(dateObj.getDate() + numberOfWeeks * 7);
    return dateObj;
}

export const loadingContest: Contest = {
    id: "",
    name: "My cool Contest",
    deadline: addWeeksToDate(1),
    description: "This is a contest",
    organizer: {
        id: ""
    }
}

export const loadingContests: Contest[] = [
    {
        id: "",
        name: "Contest 1",
        deadline: addWeeksToDate(1),
        description: "This is a contest"
    },
    {
        id: "",
        name: "My long Contest",
        deadline: addWeeksToDate(3),
        description: "Another contest!"
    },
    {
        id: "",
        name: "CodingChallenge",
        deadline: addWeeksToDate(1),
        description: "Try to solve this coding challenge for no prize whatsoever!"
    }
]

export type ButtonVariant = {
    variant?: VariantProps<typeof buttonVariants>["variant"];
    size?: VariantProps<typeof buttonVariants>["size"];
}

export function buttonStyles(styles: ButtonVariant) {
    return buttonVariants.variants.variant[styles.variant ?? "default"] + " " + buttonVariants.variants.size[styles.size ?? "default"];
}
