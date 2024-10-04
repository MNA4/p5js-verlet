class Selections {
    constructor (world) {
        this.world = world;
        this.selectedPoints = [];
        this.pointDatas = [];
        this.tools = {
            settings: {
                element: document.getElementById('settings'), 
                object: new SettingsTool(this)
            },
            select: {
                element: document.getElementById('select'), 
                object: new SelectTool(this)
            },
            segment: {
                element: document.getElementById('segment'), 
                object: new SegmentTool(this)
            },
            point: {
                element: document.getElementById('point'), 
                object: new PointTool(this)
            } 
        };
    }
    
    onmousedown (evt) {
        if (stopped) {
            selectionManager.tools[selectedTool]['object'].onmousedown(evt);
        }
    }
    onmouseup (evt) {
        if (stopped) {
            selectionManager.tools[selectedTool]['object'].onmouseup(evt);
        }
    }
    onmousemove (evt) {
        if (stopped) {
            selectionManager.tools[selectedTool]['object'].onmousemove(evt);
        }
    }
    drawSelections() {
        ctx.fillStyle = style.getPropertyValue('--hover')+'99';
        for (let i of this.selectedPoints) {
            ctx.beginPath();
            ctx.arc(
                this.world.points[i].pos.x, 
                this.world.points[i].pos.y, 
                this.world.points[i].radius+5, 
                0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
        }
    }
    addPoint(pos, radius, mass = 1) {
        this.pointDatas.push({
            x: pos.x,
            y: pos.y,
            radius: radius,
            mass: mass
        });
        new Point(this.world, pos, radius, mass);
    }
    reloadSave() {
        this.pointDatas = [];
        for (let i = 0; i < this.world.points.length; i++) {
            this.pointDatas.push({
                x: this.world.points[i].pos.x,
                y: this.world.points[i].pos.y,
                radius: this.world.points[i].radius,
                mass: this.world.points[i].mass,
            });
        }
    }
    reloadStructure() {
        for (let i = 0; i < this.pointDatas.length; i++) {
            this.world.points[i].pos.x = this.pointDatas[i]['x'];
            this.world.points[i].pos.y = this.pointDatas[i]['y'];
            this.world.points[i].prevPos.x = this.pointDatas[i]['x'];
            this.world.points[i].prevPos.y = this.pointDatas[i]['y'];
            this.world.points[i].radius = this.pointDatas[i]['radius'];
            this.world.points[i].mass = this.pointDatas[i]['mass'];
        }
    }
}
class SettingsTool {
    constructor (selections) {
        this.world = selections.world;
        this.selections = selections;
        this.id = 'settings';
    }
    onmousedown (evt) {

    }
    onmousemove (evt) {

    }
    onmouseup (evt) {
        
    }
}
class SelectTool {
    constructor (selections) {
        this.world = selections.world;
        this.selections = selections;
        this.id = 'select';
    }
    onmousedown (evt) {

    }
    onmousemove (evt) {

    }
    onmouseup (evt) {
        
    }
}
class SegmentTool {
    constructor (selections) {
        this.world = selections.world;
        this.selections = selections;
        this.id = 'segment';
    }
    onmousedown (evt) {

    }
    onmousemove (evt) {

    }
    onmouseup (evt) {

    }
}
class PointTool {
    constructor (selections) {
        this.world = selections.world;
        this.selections = selections;
        this.id = 'point';
        this.clickV = false;
        this.clickS = -1;
    }
    getHoveredPoint(pos) {
        if (this.world.points.length > 0){
            for(let i = this.world.points.length-1; i >= 0; i--) {
                if (pos.sub(this.world.points[i].pos).distSquared() <= this.world.points[i].radius**2) {
                    return i;
                }
            }
        }
        return -1;
    }
    onmousedown(evt) {
        let v = new Vector2D(evt.offsetX, evt.offsetY);
        let s = this.getHoveredPoint(v);
        this.clickV = v;
        this.clickS = s;
        if (s != -1) {
            if (!shiftKey && !this.selections.selectedPoints.includes(s)) {
                this.selections.selectedPoints = [s];
                this.world.renderObjects();
                this.selections.drawSelections();
            }
        }
    }
    onmousemove(evt) {
        if (mouseDown) {
            if (this.selections.selectedPoints.includes(this.clickS)) {
                for (let i of this.selections.selectedPoints) {
                    this.world.points[i].pos.x += evt.movementX;
                    this.world.points[i].pos.y += evt.movementY;
                    this.world.points[i].prevPos.x += evt.movementX;
                    this.world.points[i].prevPos.y += evt.movementY;
                }
            }
            this.world.renderObjects();
            this.selections.drawSelections();
        }
    }
    onmouseup(evt) {
        const v = new Vector2D(evt.offsetX, evt.offsetY);
        const s = this.getHoveredPoint(v);
        const m = this.clickV.sub(v).distManhattan() < 1;

        if (s == -1) {
            if (!shiftKey && m){
                if (this.selections.selectedPoints.length > 1) {
                    this.selections.selectedPoints = [];
                }
                else {
                    this.selections.addPoint(v, 10);
                    this.selections.selectedPoints = [this.world.points.length-1];
                }
            }
        } else {
            if (this.selections.selectedPoints.includes(s)) {
                if (shiftKey) {
                    const index = this.selections.selectedPoints.indexOf(s);
                    this.selections.selectedPoints.splice(index, 1);
                } else if (m) {
                    this.selections.selectedPoints = [s];
                }
            } else  if (m) {
                if (!shiftKey) {
                    this.selections.selectedPoints = [];
                }
                this.selections.selectedPoints.push(s);
            } 
        }
        this.world.renderObjects();
        this.selections.drawSelections();
    }
    onkeypress (evt) {
        if(evt.keyCode == 46) {

        }
    }
}
const selectionManager = new Selections(world);

let selectedTool = 'point';
let shiftKey = false;
let mouseDown = false;

for (let k in selectionManager.tools) {
    selectionManager.tools[k]['element'].onclick = function() {
        selectedTool = k;
    }
}

onmousedown = () => mouseDown = true;
onmouseup = () => mouseDown = false;
onkeydown = (evt) => shiftKey = evt.shiftKey;
onkeyup = (evt) => shiftKey = evt.shiftKey;

canvas.onmousedown = selectionManager.onmousedown;
canvas.onmouseup = selectionManager.onmouseup;
canvas.onmousemove = selectionManager.onmousemove;