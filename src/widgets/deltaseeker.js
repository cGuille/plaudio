class DeltaSeekerWidget extends ClickWidget {
    get selector() {
        return '.plaudio-seek';
    }

    onClick(event) {
        const delta = parseFloat(event.target.dataset.seek);
        this.owner.audio.currentTime += delta;
    }
}
