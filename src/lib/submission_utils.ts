export function isSupported(contentType: string | undefined | null) {
    return contentType != undefined && (
        contentType.startsWith("image/")
        || contentType == "application/pdf"
    )
}
