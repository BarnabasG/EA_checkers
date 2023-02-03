
export function decToBin(dec: number) {
    return (dec >>> 0).toString(2);
}

export function pad(n: string, width=3, z=0) {
    return (String(z).repeat(width) + String(n)).slice(String(n).length)
}