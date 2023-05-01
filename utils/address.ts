export function formatAddress(address: string): string {
    const len = address.length;
    return len > 6 ? address.substring(0, 3) + '...' + address.substring(len - 3, len) : address;
}