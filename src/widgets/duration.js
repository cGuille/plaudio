import { formatTime } from '../functions'
import Widget from './base';

export default class DurationWidget extends Widget {
    get selector() {
        return '.plaudio-duration';
    }

    initialize() {
        this.updateDuration(0);
    }

    updateDuration(duration) {
        this.elements.forEach(element => element.textContent = formatTime(duration));
    }
}
