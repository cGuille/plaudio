import Track from './track';
import NowPlayingWidget from './widgets/nowplaying';
import TimerWidget from './widgets/timer';
import DurationWidget from './widgets/duration';
import PrevWidget from './widgets/prev';
import NextWidget from './widgets/next';
import PlayPauseWidget from './widgets/playpause';
import DeltaSeekerWidget from './widgets/deltaseeker';
import SeekerWidget from './widgets/seeker';
import KeybindsWidget from './widgets/keybinds';

export default class Player {
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
