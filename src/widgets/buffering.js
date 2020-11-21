import Widget from './base';

export default class BufferingWidget extends Widget {
    get selector() {
        return '.plaudio-buffering';
    }

    initialize() {
        this.elements.forEach(element => element.style.position = 'relative');
    }

    updateDuration(duration) {
        this.duration = duration;
        this.updateView();
    }

    updateProgress(buffered) {
        this.buffered = buffered;
        this.updateView();
    }

    updateView() {
        if (!this.duration || !this.buffered) {
            return;
        }

        this.elements.forEach(element => this.updateProgressFor(element));
    }

    updateProgressFor(element) {
        const duration = this.duration;
        const buffered = this.buffered;
        const delta = element.childElementCount - buffered.length;

        if (delta > 0) {
            this.removeChildren(element, delta);
        } else if (delta < 0) {
            this.addChildren(element, -delta);
        }

        for (let i = 0; i < buffered.length; ++i) {
            const range = element.children[i];
            const start = buffered.start(i);
            const end = buffered.end(i);

            range.style.left = `${(start / duration) * 100}%`;
            range.style.width = `${((end - start) / duration) * 100}%`;
        }
    }

    removeChildren(element, n) {
        for (let i = 0; i < n; ++i) {
            element.removeChild(element.firstElementChild);
        }
    }

    addChildren(element, n) {
        for (let i = 0; i < n; ++i) {
            const child = document.createElement('div');
            child.style.position = 'absolute';
            child.style.height = '100%';
            element.appendChild(child);
        }
    }
}
