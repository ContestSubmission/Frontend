import type { Infer, Schema, SuperValidated } from "sveltekit-superforms";
import type { Readable, Unsubscriber } from "svelte/store";

type ValidateFormFunction<T extends Schema> = () => Promise<SuperValidated<Infer<T>>>;
type SubscribeFunction<T> = (value: T) => void;

interface ContinuousValidationStore<T extends Schema> extends Readable<SuperValidated<Infer<T>>> {
    subscribe: (run: SubscribeFunction<SuperValidated<Infer<T>>>) => Unsubscriber;
}

/**
 * returns a store that will update when the form data changes
 * @param formData the data of the form
 * @param validateForm the function to validate the entire form
 */
export function continuousValidation<T extends Schema>(formData: Readable<Infer<T>>, validateForm: ValidateFormFunction<T>): ContinuousValidationStore<T> {
    return {
        subscribe: (callback) => {
            return formData.subscribe(async (_) => { // NOSONAR TS issue, do not care
                const validation = await validateForm();
                callback(validation);
            });
        }
    }
}
