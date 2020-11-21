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
