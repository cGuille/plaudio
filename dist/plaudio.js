(function () {
    'use strict';


function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    let formatted = '';

    if (minutes < 10) {
        formatted += '0';
    }
    formatted += minutes;

    formatted += ':'

    if (seconds < 10) {
        formatted += '0';
    }
    formatted += seconds;

    return formatted;
}


class Widget {
    attachTo(owner) {
        this.owner = owner;

        if (this.selector) {
            this.elements = Array.from(owner.container.querySelectorAll(this.selector));
        }

        this.initialize();
    }

    initialize() {}
    handlePlay() {}
    handlePause() {}
    updateTrack(previousT, newTrack) {}
    updateTime(time) {}
    updateDuration(duration) {}
}


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


class NowPlayingWidget extends Widget {
    get selector() {
        return '.plaudio-now-playing';
    }

    updateTrack(previousT, newTrack) {
        this.elements.forEach(element => element.textContent = newTrack.label);
    }
}


class TimerWidget extends Widget {
    get selector() {
        return '.plaudio-timer';
    }

    initialize() {
        this.updateTime(0);
    }

    updateTime(time) {
        this.elements.forEach(element => element.textContent = formatTime(time));
    }
}


class DurationWidget extends Widget {
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


class PlayPauseWidget extends Widget {
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


class PrevWidget extends ClickWidget {
    get selector() {
        return '.plaudio-prev';
    }

    onClick() {
        this.owner.prev();
    }
}


class NextWidget extends ClickWidget {
    get selector() {
        return '.plaudio-next';
    }

    onClick() {
        this.owner.next();
    }
}


class DeltaSeekerWidget extends ClickWidget {
    get selector() {
        return '.plaudio-seek';
    }

    onClick(event) {
        const delta = parseFloat(event.target.dataset.seek);
        this.owner.audio.currentTime += delta;
    }
}


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


class KeybindsWidget extends Widget {
    initialize() {
        const bindingDataSetItems = [
            'PlayPause',
            'Prev',
            'Next',
            'SeekDelta',
        ];

        this.bindings = bindingDataSetItems
            .map(item => ({ action: item, spec: this.owner.container.dataset['keybind' + item] }))
            .filter(binding => binding.spec && binding.spec.trim())
            .map(binding => this.parse(binding))
            .reduce((acc, binding) => {
                binding.calls.forEach(call => {
                    call.action = binding.action;
                    acc.push(call);
                });

                return acc;
            }, [])
            ;

        window.addEventListener('keyup', event => {
            this.bindings
                .filter(binding => this.bindingMatches(binding, event))
                .forEach(binding => this.performActionOf(binding))
                ;
        });
    }

    bindingMatches(binding, event) {
        const match = (
            binding.keys.code === event.code &&
            binding.keys.ctrl === event.ctrlKey &&
            binding.keys.shift === event.shiftKey &&
            binding.keys.alt === event.altKey
        );

        return match;
    }

    performActionOf(binding) {
        if (binding.action === 'PlayPause') {
            this.owner.togglePlayPause();
            return;
        }

        if (binding.action === 'Prev') {
            this.owner.prev();
            return;
        }

        if (binding.action === 'Next') {
            this.owner.next();
            return;
        }

        if (binding.action === 'SeekDelta') {
            const delta = parseFloat(binding.args[0]);
            this.owner.audio.currentTime += delta;
            return;
        }

        console.error(`Unsupported action '${binding.action}`);
    }

    parse(binding) {
        const calls = binding.spec
            .trim()
            .split('|')
            .map(s => s.trim())
            .map(s => this.parseCalls(s))
            ;

        return {
            action: binding.action,
            calls: calls,
        };
    }

    parseCalls(spec) {
        const parts = spec.split(':').map(s => s.trim());

        return {
            keys: this.parseKeys(parts[0]),
            args: this.parseArgs(parts[1] || ''),
        };
    }

    parseKeys(keysString) {
        return keysString
            .split('+')
            .map(s => s.trim())
            .reduce((keys, keyword) => {
                if (this.isUpperCase(keyword[0])) {
                    keys.code = keyword;
                } else {
                    keys[keyword] = true;
                }

                return keys;
            }, { code: null, ctrl: false, shift: false, alt: false })
            ;
    }

    parseArgs(argsString) {
        return argsString.split(',').map(s => s.trim());
    }

    isUpperCase(char) {
        const isUpper = char === char.toUpperCase();
        const isLower = char === char.toLowerCase();

        if ((isUpper && isLower) || (!isUpper && !isLower)) {
            throw new Error(`Unsupported char: '${char}'`);
        }

        return isUpper;
    }
}


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


class Plaudio {
    constructor(container) {
        this.container = container;
        this.widgets = [];

        this.loadTracks();
        this.initAudio();

        this.register(new NowPlayingWidget());
        this.register(new TimerWidget());
        this.register(new DurationWidget());
        this.register(new PrevWidget());
        this.register(new NextWidget());
        this.register(new PlayPauseWidget());
        this.register(new DeltaSeekerWidget());
        this.register(new SeekerWidget());
        this.register(new KeybindsWidget());
    }

    register(widget) {
        widget.attachTo(this);
        this.widgets.push(widget);
    }

    loadTracks() {
        this.tracks = Array
            .from(this.container.querySelectorAll('.plaudio-track'))
            .map((elt, index) => new Track(elt, index))
            ;

        this.tracks.forEach(track => track.element.addEventListener('click', () => {
            this.selectTrack(track);
            this.play();
        }));
    }

    initAudio() {
        this.audio = new Audio();

        this.audio.addEventListener('play', () => {
            this.container.classList.remove('paused');
            this.container.classList.add('playing');

            this.widgets.forEach(widget => widget.handlePlay());
        });

        this.audio.addEventListener('pause', () => {
            this.container.classList.remove('playing');
            this.container.classList.add('paused');

            this.widgets.forEach(widget => widget.handlePause());
        });

        this.audio.addEventListener('timeupdate', () => {
            const time = this.audio.currentTime;
            this.widgets.forEach(widget => widget.updateTime(time));
        });

        this.audio.addEventListener('durationchange', () => {
            const duration = this.audio.duration;
            this.widgets.forEach(widget => widget.updateDuration(duration));
        });

        this.audio.addEventListener('ended', () => this.next());

        if (!this.tracks.length) {
            return;
        }

        let selectedTrackIndex = this.tracks.findIndex(track => track.startHere);

        if (selectedTrackIndex === -1) {
            selectedTrackIndex = 0;
        }

        const selectedTrack = this.tracks[selectedTrackIndex];

        this.selectTrack(selectedTrack);

        if (selectedTrack.startAt) {
            this.audio.currentTime = selectedTrack.startAt;
        }
    }

    prev() {
        const prevIndex = this.currentTrack.index - 1;

        if (!this.tracks[prevIndex]) {
            return;
        }

        this.selectTrack(this.tracks[prevIndex]);
        this.play();
    }

    next() {
        const nextIndex = this.currentTrack.index + 1;

        if (!this.tracks[nextIndex]) {
            return;
        }

        this.selectTrack(this.tracks[nextIndex]);
        this.play();
    }

    play() {
        return this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    togglePlayPause() {
        this.audio.paused ? this.play() : this.pause();
    }

    selectTrack(newTrack) {
        const previousTrack = this.currentTrack;
        this.currentTrack = newTrack;

        if (previousTrack) {
            previousTrack.deselect();
        }
        newTrack.select();

        this.audio.src = newTrack.url;

        this.widgets.forEach(widget => widget.updateTrack(previousTrack, newTrack));
    }
}


window.plaudio = {
    all: () => Array.from(document.querySelectorAll('.plaudio')).forEach(el => new Plaudio(el)),
    new: container => new Plaudio(container),
};


}());
