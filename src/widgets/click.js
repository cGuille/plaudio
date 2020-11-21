class ClickWidget extends Widget {
    initialize() {
        const clickHandler = this.onClick.bind(this);

        this.elements.forEach(element => {
            element.addEventListener('click', clickHandler);
        });
    }

    onClick() {
        throw new Error(`Not implemented in ${this.constructor.name}`);
    }
}
