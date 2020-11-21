class NextWidget extends ClickWidget {
    get selector() {
        return '.plaudio-next';
    }

    onClick() {
        this.owner.next();
    }
}
