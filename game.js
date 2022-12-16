let canvas = document.querySelector("canvas")
let scoreDiv = document.querySelector(".score")
let gameOverDiv = document.querySelector(".gameover")


canvas.height = window.innerHeight
canvas.width = window.innerWidth

window.addEventListener("resize", () => {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

})


let ctx = canvas.getContext("2d")


//spaceship
class Spaceship {
    constructor() {
        this.x = canvas.width / 2 - 30
        this.y = canvas.height - 80
        this.color = "black"
        this.speed = 20
        this.height = 60
        this.width = 60
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)

    }
}
let spaceship = new Spaceship()  //main spaceship



//bullets
class Bullet {
    constructor() {
        this.x = spaceship.x + 30
        this.y = spaceship.y

        this.color = "blue"
        this.speed = 10
    }
    draw() {
        ctx.fillRect(this.x, this.y, 5, 10)
    }
    move() {
        this.y -= this.speed
    }
}


//enemy
class Enemy {
    constructor() {
        this.x = Math.random() * canvas.width
        // this.x = canvas.width / 2
        this.y = 0
        this.speed = Math.random() * 3
        this.height = 30
        this.width = 30
        this.color = "blue"
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    move() {
        this.y += this.speed
    }
}


//calculate the distance between objects
const getDistance = (x1, y1, x2, y2) => {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}

//update score in html
let score = 0
const updateScore = () => {
    scoreDiv.innerText = score
}





window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "Down": // IE/Edge specific value
        case "ArrowDown":
            // Do something for "down arrow" key press.
            spaceship.y < canvas.height - spaceship.height && (spaceship.y += spaceship.speed)
            break;
        case "Up": // IE/Edge specific value
        case "ArrowUp":
            // Do something for "up arrow" key press.
            spaceship.y > 0 && (spaceship.y -= spaceship.speed)
            break;
        case "Left": // IE/Edge specific value
        case "ArrowLeft":
            // Do something for "left arrow" key press.
            //move the spaceship towards left

            spaceship.x > 0 && (spaceship.x -= spaceship.speed)

            break;
        case "Right": // IE/Edge specific value
        case "ArrowRight":
            // Do something for "right arrow" key press.
            //move the spaceship towards right
            spaceship.x < canvas.width - spaceship.width && (spaceship.x += spaceship.speed)


            break;
        case "Enter":
            // Do something for "enter" or "return" key press.
            break;
        case "Esc": // IE/Edge specific value
        case "Escape":
            // Do something for "esc" key press.
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}, true);



let frameCount = 0 //flag for reproduction of new bullet
let frameCountForEnemyProduction = 0  //flag for reproduction of new enemy
let bullets = [] //list of bullets
let enemies = [] //list of enemies

let gameOver = false  //gameover flag


function gameloop() {

    //checking for gameover flag
    if(gameOver){
        gameOverDiv.style.display = "flex"
    }else{
        requestAnimationFrame(gameloop)
    }


    frameCount++
    frameCountForEnemyProduction++

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    spaceship.draw()




    //reproducing new bullet after 10 frames
    if (frameCount == 10) {
        let bullet = new Bullet()
        bullets.push(bullet)
        frameCount = 0
    }


    //limiting the number of bullets to 10 at a time. since 1st bullet has already crossed the screen
    if (bullets.length > 10) {
        bullets.shift()
    }


    //producing range of bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw()
        bullets[i].move()
    }



    //reproducing new enemy after 100 frames
    if (frameCountForEnemyProduction > 100) {

        let enemy = new Enemy()
        enemies.push(enemy)

        frameCountForEnemyProduction = 0
    }

    //limiting the number of enemies to 20 at a time
    if (enemies.length > 20) {
        enemies.shift()
    }

    //producing range of enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw()
        enemies[i].move()
    }


    //determining bullet and enemy collision
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (getDistance(enemies[j].x + 15, enemies[j].y + 15, bullets[i].x, bullets[i].y) < 20) {
                //    ctx.fillStyle = "black"
                if (enemies[j].color == "blue") {
                    score++
                    updateScore()

                }
                enemies[j].color = "black"



            }
        }
    }


    //determining gameover
    for (let i = 0; i < enemies.length; i++) {
        if(getDistance(enemies[i].x+14, enemies[i].y+14, spaceship.x+30, spaceship.y+30)< 40){
            spaceship.color = "red"
            gameOver = true

        }
        
    }
    


}



gameloop()

