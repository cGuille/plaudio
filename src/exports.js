window.plaudio = {
    all: () => Array.from(document.querySelectorAll('.plaudio')).forEach(el => new Plaudio(el)),
    new: container => new Plaudio(container),
};
