(function () {
    'use strict';

    class Plaudio {
        constructor(container) {
            this.container = container;
            this.nowPlayingDisplays = Array.from(container.querySelectorAll('.plaudio-now-playing'));
            this.timerDisplays = Array.from(container.querySelectorAll('.plaudio-timer'));
            this.durationDisplays = Array.from(container.querySelectorAll('.plaudio-duration'));

            this.loadTracks();
            this.initAudio();
            this.initControls();
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

                this.container.querySelectorAll('.plaudio-play-pause').forEach(element => {
                    setPlayPauseState(element, 'playing');
                });
            });

            this.audio.addEventListener('pause', () => {
                this.container.classList.remove('playing');
                this.container.classList.add('paused');

                this.container.querySelectorAll('.plaudio-play-pause').forEach(element => {
                    setPlayPauseState(element, 'paused');
                });
            });

            this.audio.addEventListener('timeupdate', () => {
                const time = this.audio.currentTime;
                this.timerDisplays.forEach(elt => updateTime(elt, time));
            });

            this.audio.addEventListener('durationchange', () => {
                const duration = this.audio.duration;
                this.durationDisplays.forEach(elt => updateTime(elt, duration));
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

        selectTrack(track) {
            if (this.currentTrack) {
                this.currentTrack.deselect();
            }

            this.currentTrack = track;
            this.currentTrack.select();

            this.audio.src = track.url;

            this.nowPlayingDisplays.forEach(elt => elt.textContent = track.label);
            this.timerDisplays.forEach(elt => updateTime(elt, 0));
        }

        initControls() {
            this.initPlayPauseControls();
            this.initPrevNextControls();
        }

        initPlayPauseControls() {
            this.container.querySelectorAll('.plaudio-play-pause').forEach(element => {
                setPlayPauseState(element, 'paused');

                element.addEventListener('click', () => {
                    if (this.audio.paused) {
                        this.play();
                    } else {
                        this.pause();
                    }
                });
            });
        }

        initPrevNextControls() {
            this.container.querySelectorAll('.plaudio-prev').forEach(element => {
                element.addEventListener('click', () => this.prev());
            });

            this.container.querySelectorAll('.plaudio-next').forEach(element => {
                element.addEventListener('click', () => this.next());
            });
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

    function setPlayPauseState(element, state) {
        if (state === 'playing') {
            element.innerHTML = element.dataset.pauseHtml;
        } else if (state === 'paused') {
            element.innerHTML = element.dataset.playHtml;
        }
    }

    function updateTime(elt, time) {
        elt.textContent = new Date(time * 1000).toISOString().substr(11, 8);
    }

    window.plaudio = {
        all: () => Array.from(document.querySelectorAll('.plaudio')).forEach(el => new Plaudio(el)),
        new: container => new Plaudio(container),
    };
}())
