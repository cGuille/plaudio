import ClickWidget from './click';

export default class PrevWidget extends ClickWidget {
    get selector() {
        return '.plaudio-prev';
    }

    onClick() {
        this.owner.prev();
    }
}
