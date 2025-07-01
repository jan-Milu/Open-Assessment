const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// https://stackoverflow.com/questions/8205828/html5-canvas-performance-and-optimization-tips-tricks-and-coding-best-practices/8485927#8485927
const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
var colors = ["red", "orange", "royalblue", "seagreen"]

// add msgs to page, color, test test, then good!
// msgs on page with elements in html pls
// also have some speed

class Game {
    constructor(questions) {
        this.player = new Player();
        this.food = [];
        this.taken = [];
        this.done = [];
        this.questions = questions;
        this.score = 0;

        window.addEventListener("keydown", this.input.bind(this));
        
        this.next_question();
        this.running = setInterval(() => this.update(), 500);
    }

    input(e) {
        //console.log("input");
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
                if (food.correct == true) this.score = this.score + 1;
                this.player.grow();

                this.next_question();
                //console.log("et");
                return true;
            }
        });

        this.clear();
        this.player.draw();

        this.food.forEach(food => {
            food.draw();
        });

        //console.log(this.player.segments.length);
    }

    next_question() {
        this.food = [];

        if (this.done.length == this.questions.length) {
            alert(`Done! your score was ${this.score}`);
            clearInterval(this.running);
            return false;
        }
        
        var qIndex = Math.floor(Math.random() * this.questions.length);
        while (this.done.includes(qIndex) == true) {
            qIndex = Math.floor(Math.random() * this.questions.length);
        }
        
        const question_display = document.getElementById("question");
        const answer_list = document.getElementById("answers");
        
        const question = this.questions[qIndex];
        this.done.push(qIndex);
        console.log(this.questions);
        //console.log(question);

        question_display.innerHTML = question.question;
        answer_list.innerHTML = "";

        colors = colors.sort((a, b) => 0.5 - Math.random());

        this.food.push(new Food(this.taken, question.answer, true, colors[0]));
        var li = document.createElement("li");
        li.innerHTML = question.answer;
        li.style.backgroundColor = colors[0];
        answer_list.appendChild(li);

        
        var i = 1;
        question.false_answers.forEach(ans => {
            if (ans != null) this.food.push(new Food(this.player.segments[this.player.segments.length - 1], ans, false, colors[i]));
            li = document.createElement("li");
            li.innerHTML = ans;
            li.style.backgroundColor = colors[i];
            answer_list.appendChild(li);

            i += 1;
        });

        this.food = this.food.sort((a, b) => 0.5 - Math.random());
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
            //console.log(this.segments[i].x, this.segments[i].y);
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
        //console.log(this.x, this.y);
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
        //console.log("head");
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
    constructor(head, answer, correct, color) {
        this.x = Math.floor(Math.random() * 19) * 50;
        this.y = Math.floor(Math.random() * 9) * 50;
        
        if (this.x >= head.x) this.x = this.x + 50;
        if (this.y >= head.y) this.y = this.y + 50;

        this.answer = answer;
        this.correct = correct;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 25, this.y - 25, 50, 50);
    }
}

function start(questions) {
    canvas.width = 1000;
    canvas.height = 500;
    

    const game = new Game(questions);
}


const params = new URLSearchParams(window.location.search);
const id = params.get('quiz');
console.log(id);

fetch(`/get_questions/${id}`)
                    .then(response => response.json())
                    .then(data => start(data));
console.log(questions);



