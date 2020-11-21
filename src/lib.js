import Player from './player';

export { all, player };

function all() {
    Array.from(document.querySelectorAll('.plaudio')).forEach(el => new Player(el));
}

function player(container) {
    return new Player(container);
}
