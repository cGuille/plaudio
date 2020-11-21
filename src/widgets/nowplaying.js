class NowPlayingWidget extends Widget {
    get selector() {
        return '.plaudio-now-playing';
    }

    updateTrack(previousT, newTrack) {
        this.elements.forEach(element => element.textContent = newTrack.label);
    }
}
