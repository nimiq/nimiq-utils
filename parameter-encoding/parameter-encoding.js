export function dashToSpace(string) {
    return string.replace(/-/gi, ' ');
}

export function spaceToDash(string) {
    return string.replace(/ /gi, '-');
}