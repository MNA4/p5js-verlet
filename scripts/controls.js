let playing = false;
let stopped = true;

const controls = {
    step: document.getElementById('skip'),
    play: document.getElementById('play'),
    stop: document.getElementById('stop')
}
controls.step.onclick = function () {
    if (stopped) {
        controls.stop.removeAttribute('disabled');
        selectionManager.reloadSave();
        stopped = false;
        playing = false;
        requestAnimationFrame(loop);
        world.updatePhysics();
        world.renderObjects();
    } else {
        playing = false;
        controls.play.textContent = 'play_arrow';
        world.updatePhysics();
        world.renderObjects();
    } 
}
controls.play.onclick = function() {
    if (controls.play.textContent != 'pause') {
        controls.play.textContent = 'pause';
        controls.stop.removeAttribute('disabled');
        if (stopped) {
            selectionManager.reloadSave();
            requestAnimationFrame(loop);
        }
        stopped = false;
        playing = true;
    }
    else {
        playing = false;
        controls.play.textContent = 'play_arrow';
    }
}
controls.stop.onclick = function() {
    controls.stop.toggleAttribute('disabled', true);
    stopped = true;
    playing = false;
    controls.play.textContent = 'play_arrow';
    selectionManager.reloadStructure();
    world.renderObjects();
    selectionManager.drawSelections();
}