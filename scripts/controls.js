let playing = false;
let stopped = true;

const controls = {
    step: document.getElementById('skip'),
    play: document.getElementById('play'),
    stop: document.getElementById('stop')
}
controls.step.onclick = function () {
    if (!stopped) {
        playing = false;
        controls.play.textContent = 'play_arrow';
        world.updatePhysics();
        world.renderObjects();
    }
}
controls.play.onclick = function() {
    if (controls.play.textContent != 'pause') {
        controls.play.textContent = 'pause';
        if (stopped) {
            requestAnimationFrame(loop);
        }
        controls.stop.removeAttribute('disabled');
        controls.step.removeAttribute('disabled');
        stopped = false;
        playing = true;
        selectionManager.reloadSave();
    }
    else {
        playing = false;
        controls.play.textContent = 'play_arrow';
    }
}
controls.stop.onclick = function() {
    controls.step.toggleAttribute('disabled', true);
    controls.stop.toggleAttribute('disabled', true);
    stopped = true;
    playing = false;
    controls.play.textContent = 'play_arrow';
    selectionManager.reloadStructure();
    world.renderObjects();
    selectionManager.drawSelections();
}