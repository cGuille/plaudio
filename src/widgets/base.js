export default class Widget {
    attachTo(owner) {
        this.owner = owner;

        if (this.selector) {
            this.elements = Array.from(owner.container.querySelectorAll(this.selector));
        }

        this.initialize();
    }

    initialize() {}
    handlePlay() {}
    handlePause() {}
    updateTrack(previousT, newTrack) {}
    updateTime(time) {}
    updateDuration(duration) {}
    updateProgress(buffered) {}
}
