canvas.onclick = function(evt) {
    new Point(world, new Vector2D(evt.offsetX, evt.offsetY), 7);
    world.renderObjects();
}