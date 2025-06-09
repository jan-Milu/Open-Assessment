const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

class Game {
    constructor() {
        this.player = new Player();

        window.addEventListener("keydown", this.input.bind(this));
    }

    input(e) {
        console.log("input");
        if (e.key == "w" || e.key == "ArrowUp") {
            this.player.turn(3);
        } 
        else if (e.key == "d" || e.key == "ArrowRight") {
            this.player.turn(0);
        }
        else if (e.key == "s" || e.key == "ArrowDown") {
            this.player.turn(1);
        }
        else if (e.key == "a" || e.key == "ArrowLeft") {
            this.player.turn(2);
        }
    }

    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    update() {
        this.player.move();
        this.clear();
        this.player.draw();

        console.log("updated??");
    }
}

class Player {
    constructor() {
        this.segments = [new Head(this, 100, 100)]; //index 0 is the last segment, counting up towards head
    }

    move() {
        for (let i = this.segments.length - 1; i >= 0; i--) {
            this.segments[i].move();
        }
    }

    draw() {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw();
        }
    }

    grow() {
        this.segments.unshift(new Segment(this));
    }

    turn(dir) {
        this.segments[this.segments.length - 1].turn(dir);
    }
}

class Head {
    constructor(player, x, y) {
        this.player = player;

        this.x = x;
        this.y = y;
        this.dir = 0;
    }

    move() {
        this.x = this.x + 100 * directions[this.dir][0];
        this.y = this.y + 100 * directions[this.dir][1];
        console.log(this.x, this.y);
    }

    turn(dir) {
        if ((dir + this.dir) % 2 != 0) {
            this.dir = dir;
        }
        console.log(this.dir);
    }

    draw() {
        const [dx, dy] = directions[this.dir];

        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(this.x + 50 * dx, this.y + 50 * dy);
        ctx.lineTo(this.x - 50 * dx + 50 * dy, this.y - 50 * dy + 50 * dx);
        ctx.lineTo(this.x - 50 * dx - 50 * dy, this.y - 50 * dy - 50 * dx);
        ctx.closePath();
        ctx.fill();
        console.log("head");
    }
}

class Segment {
    constructor(player) {
        this.player = player;
        this.next = player.segments[0];

        this.x = this.next.x;
        this.y = this.next.y;
        this.dir = this.next.dir;
    }

    move() {
        this.x = this.next.x;
        this.y = this.next.y;
        this.dir = this.next.dir;
    }

    draw() {
        const [dx, dy] = directions[this.dir];

        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(this.x - 50 * dx - 50 * dy, this.y - 50 * dy - 50 * dx);
        ctx.lineTo(this.x - 50 * dx + 50 * dy, this.y - 50 * dy + 50 * dx);

        ctx.lineTo(this.x + 50 * dx - 50 * dy, this.y + 50 * dy - 50 * dx);
        ctx.lineTo(this.x + 50 * dx + 50 * dy, this.y + 50 * dy + 50 * dx);

        ctx.closePath();
        ctx.stroke();
    }
}

const game = new Game();
canvas.width = 480*2;
canvas.height = 270*2;

setInterval(() => game.update(), 1000);