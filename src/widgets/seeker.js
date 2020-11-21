class SeekerWidget extends Widget {
    get selector() {
        return '.plaudio-seeker';
    }

    initialize() {
        const changeHandler = this.updateCurrentTime.bind(this);

        this.elements.forEach(element => {
            element.addEventListener('input', this.markAsSeeking);
            element.addEventListener('change', changeHandler);
        });

        this.time = 0;
        this.duration = null;

        this.updateView();
    }

    updateTime(time) {
        this.time = time;
        this.updateView();
    }

    updateDuration(duration) {
        this.duration = duration;
        this.updateView();
    }

    markAsSeeking(event) {
        event.target.seeking = true;
    }

    updateCurrentTime(event) {
        this.owner.audio.currentTime = event.target.value;
        event.target.seeking = false;
    }

    updateView() {
        this.elements
            .filter(element => !element.seeking)
            .forEach(element => {
                if (this.duration !== null) {
                    element.max = this.duration;
                }

                element.value = this.time;
            });
    }
}
