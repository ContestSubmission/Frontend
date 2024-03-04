/**
 * https://gist.github.com/lambrospetrou/0c9ac9da14d8d241ae3634981ceb2871?permalink_comment_id=4660572#gistcomment-4660572
 */
export async function streamToString(stream: ReadableStream) {
    const reader = stream.getReader();
    const textDecoder = new TextDecoder();
    let result = '';

    async function read() {
        const { done, value } = await reader.read();

        if (done) {
            return result;
        }

        result += textDecoder.decode(value, { stream: true });
        return read();
    }

    return read();
}

export function parseInteger(str?: string) {
    if (str === null || str === undefined) return null;
    const result = parseInt(str, 10);
    return isNaN(result) ? null : result;
}

/**
 * RFC5322 email regex
 * See: https://fjolt.com/article/javascript-how-to-validate-an-email
 */
export function validateEmail(email: string) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email);
}
