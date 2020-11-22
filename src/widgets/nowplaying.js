import Widget from './base';

export default class NowPlayingWidget extends Widget {
    get selector() {
        return '.plaudio-now-playing';
    }

    initialize() {
        this.updateView(this.owner.currentTrack);
    }

    updateTrack(previousT, newTrack) {
        this.updateView(newTrack);
    }

    updateView(track) {
        this.elements.forEach(element => element.textContent = track.label);
    }
}
