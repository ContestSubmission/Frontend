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
