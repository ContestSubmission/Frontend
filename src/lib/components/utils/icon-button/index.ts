import type { Props as PrimitiveProps, Events as PrimitiveEvents } from "$lib/components/ui/button";
import Root from "./IconButton.svelte"

type Props = PrimitiveProps & {
    buttonName: string,
    href: string
};
type Events = PrimitiveEvents;

export {
    type Props,
    type Events,
    //
    Root as ImageButton,
    type Props as ButtonProps,
    type Events as ButtonEvents
};
