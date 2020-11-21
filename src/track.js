class Track {
    constructor(element, index) {
        this.element = element;
        this.index = index;
    }

    select() {
        this.element.classList.add('selected');
    }

    deselect() {
        this.element.classList.remove('selected');
    }

    get label() {
        return this.element.textContent.trim();
    }

    get url() {
        return this.element.dataset.url;
    }

    get startHere() {
        return this.element.classList.contains('start-here');
    }

    get startAt() {
        let parsed = parseFloat(this.element.dataset.startAt);

        return isNaN(parsed) ? null : parsed;
    }
}
