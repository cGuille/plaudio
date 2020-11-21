class Widget {
    get selector() {
        throw new Error(`Not implemented in ${this.constructor.name}`);
    }

    attachTo(owner) {
        this.owner = owner;
    }

    plug(elements) {
        this.elements = elements;
    }

    initialize() {}
    handlePlay() {}
    handlePause() {}
    updateTrack(previousT, newTrack) {}
    updateTime(time) {}
    updateDuration(duration) {}
}
