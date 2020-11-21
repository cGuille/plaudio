class TimerWidget extends Widget {
    get selector() {
        return '.plaudio-timer';
    }

    initialize() {
        this.updateTime(0);
    }

    updateTime(time) {
        this.elements.forEach(element => element.textContent = formatTime(time));
    }
}
