const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// https://stackoverflow.com/questions/8205828/html5-canvas-performance-and-optimization-tips-tricks-and-coding-best-practices/8485927#8485927
directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

class Game {
    constructor() {
        this.player = new Player();
        this.food = [];
        this.taken = [];

        window.addEventListener("keydown", this.input.bind(this));
        this.food.push(new Food(200, 200, "a", true));
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

        this.food.some(food => {
            if (food.x == this.player.segments[this.player.segments.length - 1].x && food.y == this.player.segments[this.player.segments.length - 1].y) {
                if (food.correct == true) {
                    this.food = [];
                    this.player.grow();

                    this.food.push(new Food(200, 200, "a", true));
                    console.log("et");
                    return true;
                }
            }
        });

        this.clear();
        this.player.draw();

        this.food.forEach(food => {
            food.draw();
        });

        console.log(this.player.segments.length);
    }

    next_question() {
        this.food = [];
        
        const question = questions[Math.floor(Math.random() * questions.length)];

        this.food.push(new Food(this.taken, question.answer, true));

        question.false_answers.forEach(ans => {
            if (ans != null) this.food.push(new Food(this.taken, ans, false));
        });
    }
}

class Player {
    constructor() {
        this.segments = [new Head(this, 50, 50)]; //index 0 is the last segment, counting up towards head
    }

    move() {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].move();
        }
    }

    draw() {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw();
            console.log(this.segments[i].x, this.segments[i].y);
        }
    }

    grow() {
        this.segments.unshift(new Segment(this));
        console.log("grw");
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
        this.nextDir = 0;
        this.turned = false;
    }

    move() {
        this.dir = this.nextDir;
        this.x = this.x + 50 * directions[this.dir][0];
        this.y = this.y + 50 * directions[this.dir][1];
        console.log(this.x, this.y);
        this.turned = false;
    }

    turn(dir) {
        if ((dir + this.dir) % 2 != 0 && this.turned == false) {
            this.nextDir = dir;
            this.turned = true;
        }
    }

    draw() {
        const [dx, dy] = directions[this.dir];

        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(this.x + 25 * dx, this.y + 25 * dy);
        ctx.lineTo(this.x - 25 * dx + 25 * dy, this.y - 25 * dy + 25 * dx);
        ctx.lineTo(this.x - 25 * dx - 25 * dy, this.y - 25 * dy - 25 * dx);
        ctx.closePath();
        ctx.fill();
        console.log("head");
    }
}

class Segment {
    constructor(player) {
        this.player = player;
        this.next = player.segments[0];

        this.dir = this.next.dir;
        this.nextDir = this.nextDir;

        this.x = this.next.x;// - 50 * directions[this.dir][0];
        this.y = this.next.y;// - 50 * directions[this.dir][1];
    }

    move() {
        this.x = this.next.x;
        this.y = this.next.y;
        this.dir = this.nextDir;
        this.nextDir = this.next.nextDir;
    }

    draw() {
        const [dx, dy] = directions[this.dir];
        const [ndx, ndy] = directions[this.nextDir];

        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(this.x - 25 * dx - 20 * dy, this.y - 25 * dy + 20 * dx);
        ctx.lineTo(this.x - 25 * dx + 20 * dy, this.y - 25 * dy - 20 * dx);
        
        
        ctx.lineTo(this.x + 25 * ndx + 20 * ndy, this.y + 25 * ndy - 20 * ndx);
        ctx.lineTo(this.x + 25 * ndx - 20 * ndy, this.y + 25 * ndy + 20 * ndx);


        ctx.closePath();
        ctx.stroke();
    }
}

class Food {
    constructor(x, y, answer, correct) {
        this.x = x;
        this.y = y;
        
        this.answer = answer;
        this.correct = correct;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
    }
}

const game = new Game();
canvas.width = 480*2;
canvas.height = 270*2;

const params = new URLSearchParams(window.location.search);
const id = params.get('quiz');

let questions = fetch(`/get_questions/${id}`).then(response => response.json());

setInterval(() => game.update(), 500);