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
    div(n) {
        return new Vector2D(this.x / n, this.y / n);
    }
    clone() {
        return new Vector2D(this.x, this.y);
    }
    dist_squared() {
        return this.x**2 + this.y**2;
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
    constructor (world, pos, radius, mass = 1) {
        this.world = world;
        this.world.points.push(this);

        this.pos = pos;
        this.prevPos = pos.clone();

        this.radius = radius;

        this.mass = mass;
    }
    update (dt=1/30) {
        let tmp = this.pos.clone();
        this.pos = this.pos.add(this.pos.sub(this.prevPos).mult(this.world.frictionCoeff))
        this.pos.y += this.world.gravity * (dt**2);
        this.pos.y = Math.min(this.pos.y, canvas.height - this.radius);
        this.pos.x = Math.min(this.pos.x, canvas.width - this.radius);
        this.pos.x = Math.max(this.pos.x, this.radius);
        this.prevPos = tmp;
    }
    collide(point) {
        let d = point.pos.sub(this.pos);
        let dd = d.dist_squared();
        if (0 < dd < (this.radius + point.radius) ** 2) {
            d = d.div(Math.sqrt(dd));
            let i1 = this.pos.add(d.mult(this.radius));
            let i2 = point.pos.add(d.mult(point.radius));
            let midpoint = i1.mult(this.mass).add(i2.mult(point.mass)).div(this.mass+point.mass);
            this.pos = midpoint.sub(d.mult(this.radius));
            point.pos = midpoint.add(d.mult(point.radius));
        }
    }
    render () {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let world = new World();
new Point(world, new Vector2D(10, 10), 10);
new Point(world, new Vector2D(30, 10), 10);
new Point(world, new Vector2D(50, 10), 10);
new Point(world, new Vector2D(70, 10), 10);

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i of world.points) {
        i.update();
    }
    for (i of world.points) {
        i.render();
    }
    requestAnimationFrame(update);
}

window.onload = update;