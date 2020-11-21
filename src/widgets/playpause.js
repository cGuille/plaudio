import Widget from './base';

export default class PlayPauseWidget extends Widget {
    get selector() {
        return '.plaudio-play-pause';
    }

    initialize() {
        const clickHandler = () => this.owner.togglePlayPause();

        this.elements.forEach(element => {
            element.addEventListener('click', clickHandler);
        });

        this.handlePause();
    }

    handlePlay() {
        this.elements.forEach(element => element.innerHTML = element.dataset.pauseHtml);
    }

    handlePause() {
        this.elements.forEach(element => element.innerHTML = element.dataset.playHtml);
    }
}
