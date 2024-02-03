 // This is the function we wrote earlier
 export async function CopyTextToClipboard(text:string) {
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand('copy', true, text);
    }
}