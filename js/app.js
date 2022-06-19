let over = true;
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const enemyBar = document.getElementById('enemy');
const playerBar = document.getElementById('player');
const won = document.getElementById('won');
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = .7

class Fighter {
    constructor({ name, position, velocity, color, offset }) {
        this.name = name
        this.position = position
        this.velocity = velocity
        this.width = 50;
        this.height = 150;
        this.lastKey = '';
        this.health = 100;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset
            ,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking = false;
    }
    draw() {

        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        if (this.isAttacking) {
            c.fillStyle = 'blue';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 20) {
            return this.velocity.y = 0;
        }
        this.velocity.y += gravity;
    }
    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false
        }, 100);

    }
}
class Sprite {
    constructor({ position, imageSrc, scale = 1 }) {

        this.position = position
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.scale = scale;
        this.image.src = imageSrc;
    }
    draw() {

        c.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale)

    }
    update() {

        this.draw();
    }

}
const player = new Fighter(
    {
        name: prompt('First Player Name') || 'Player 1',
        position: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 10
        },
        offset: {
            x: 0,
            y: 0
        },
        color: 'red'
    }
);
player.draw();
const enemy = new Fighter(
    {
        name: prompt('Second Player Name') || 'Player2',
        position: {
            x: 400,
            y: 100
        },
        offset: {
            x: 50,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'purple'
    }
);
enemy.draw();


let lastKey = ''
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}
const whoWon = ({
    player1,
    player2
}) => {
    if (player1.health > player2.health && player2.health === 0) {
        won.innerHTML = `${player1.name} won the game!`
        over = false;
    }


}
const isCollied = ({
    player1,
    player2
}) => {
    return (
        player1.attackBox.position.x + player1.attackBox.width >= player2.position.x &&
        player1.attackBox.position.x <= player2.position.x + player2.width &&
        player1.attackBox.position.y + player1.attackBox.height >= player2.position.y &&
        player1.attackBox.position.y <= player2.height + player2.position.y

    )
}
const background = new Sprite(
    {
        position: {
            x: 0,
            y: 0
        },
        imageSrc: '../assets/bg.gif'

    }
);
function animate() {

    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player.update();
    enemy.update();


    player.velocity.x = 0
    enemy.velocity.x = 0
    if (keys.a.pressed && lastKey === 'a') {
        player.velocity.x = -5
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.velocity.x = 5
    }
    //enemy
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    //collison

    if (
        isCollied({
            player1: player,
            player2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false;
        enemy.health = enemy.health - 20;
        enemyBar.style.width = enemy.health + '%'
        whoWon({
            player1: player,
            player2: enemy
        });
    }

    if (
        isCollied({
            player1: enemy,
            player2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        player.health = player.health - 20;
        playerBar.style.width = player.health + '%'
        whoWon({
            player1: enemy,
            player2: player
        });
    }


}
animate()


window.addEventListener('keydown', (event) => {
    console.log(event.key)
    if (over) {
        switch (event.key) {

            case 'a':
                keys.a.pressed = true;
                lastKey = 'a';
                break;
            case 'd':
                keys.d.pressed = true;
                lastKey = 'd';
                break;
            case 'w':
                player.velocity.y = -15
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -15
                break;


            case ' ':
                player.attack();
                break
            case 'ArrowDown':
                enemy.attack();
                break
        }
    }

})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;

    }
    console.log(event.key)
})
let second = 60;
const timer = () => {
    const timer = document.getElementById('timer');
    if (over) {

        if (second > 0) {
            second = second - 1;
            return timer.innerHTML = second;
        }
        over = false;
        won.innerHTML = 'Timeout'
    }

}
setInterval(timer, 1000)