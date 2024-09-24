class Vector2D {
    constructor (x=0, y=0) {
        this.x = x;
        this.y = y;
    }
    add (v2d) {
        return new Vector2D(this.x + v2d.x, this.y + v2d.y);
    }
    sub (v2d) {
        return new Vector2D(this.x - v2d.x, this.y - v2d.y);
    }
    mult (n) {
        return new Vector2D(this.x * n, this.y * n);
    }
    clone() {
        return new Vector2D(this.x, this.y);
    }

}

class World {
    constructor(frictionCoeff = 0.99, gravity = 500) {
        this.frictionCoeff = frictionCoeff;
        this.gravity = gravity;
        this.points = [];
    }
}

class Point {
    constructor (world, pos, radius) {
        this.world = world;
        this.world.points.push(this);

        this.pos = pos;
        this.prevPos = pos.clone();

        this.radius = radius;
    }
    update (dt=1/30) {
        let tmp = this.pos.clone();
        this.pos = this.pos.add(this.pos.sub(this.prevPos).mult(this.world.frictionCoeff))
        this.pos.y += this.world.gravity * (dt**2);
        this.pos.y = Math.min(this.pos.y, height - this.radius);
        this.pos.x = Math.min(this.pos.x, width - this.radius);
        this.pos.x = Math.max(this.pos.x, this.radius);
        this.prevPos = tmp;
    }
    render () {
        stroke('black');
        strokeWeight(1);
        circle(this.pos.x, this.pos.y, this.radius*2);
    }
}
let world = new World();
let p1 = new Point(world, new Vector2D(10, 10), 10);
function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(200);
    p1.update();
    p1.render();
}
