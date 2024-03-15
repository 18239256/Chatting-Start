export function isExpired(date: Date) {
    return null === date || date < new Date();
}