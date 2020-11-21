export { formatTime, isUpperCase };

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    let formatted = '';

    if (minutes < 10) {
        formatted += '0';
    }
    formatted += minutes;

    formatted += ':'

    if (seconds < 10) {
        formatted += '0';
    }
    formatted += seconds;

    return formatted;
}

function isUpperCase(char) {
    const isUpper = char === char.toUpperCase();
    const isLower = char === char.toLowerCase();

    if ((isUpper && isLower) || (!isUpper && !isLower)) {
        throw new Error(`Unsupported char: '${char}'`);
    }

    return isUpper;
}
