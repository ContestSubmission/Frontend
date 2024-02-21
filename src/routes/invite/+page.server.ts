export async function load({ url }) {
    const jwt = url.searchParams.get("jwt");
    return { jwt };
}
