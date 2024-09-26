let playing = false;
let stopped = true;
const style = getComputedStyle(document.body);

const controls = {
    step: document.getElementById('skip'),
    play: document.getElementById('play'),
    stop: document.getElementById('stop')
}
const tools = {
    settings: document.getElementById('settings'),
    select: document.getElementById('select'),
    segment: document.getElementById('segment'),
    point: document.getElementById('point')
}
let selectedTool = -1;
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
}
for (let k in tools) {
    tools[k].onclick = function() {
        selectedTool = k;
    }
}
