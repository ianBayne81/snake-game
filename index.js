//draw the canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 300
canvas.height = 400
let count = 0
let snake
const selectStart = document.querySelector("#start")
selectStart.disabled.false

//create new snake game
class Snakegame {
    constructor() {
        this.x = canvas.width / 2,
        this.y = (canvas.height - 50) / 2,
        this.width = 9,
        this.height = 9,
        this.cells = [],
        this.maxCells = 5,
        this.collision = 0,
        this.diru = 0,
        this.dird = 0, 
        this.dirl = 5,
        this.dirr = 0,
        this.score = 0
        this.appleX = Math.floor(Math.random() * (1000 - 715))
        this.appleY = Math.floor(Math.random() * (1000 - 665))
        this.appleW = 15
        this.appleH = 15
    }
    gameOver() {
        this.diru = 0,
        this.dird = 0, 
        this.dirl = 0,
        this.dirr = 0,
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.shadowColor = "aqua"
        ctx.shadowBlur = 20
        ctx.font = "25px Arial"
        ctx.fillStyle = "aqua"
        ctx.fillText(`Oops!`, 115, 110)
        ctx.fillText(`Game over`, 85, 180)
        ctx.fillText(`Your score was ${this.score}`, 55, 250)
        
    }
    drawApple () {
        let apple = new Image(this.appleW, this.appleH)
        apple.src = 'images/apple.png'
        ctx.drawImage(apple, this.appleX, this.appleY, this.appleW, this.appleH)
    }
    drawScore () {
        ctx.font = "20px Arial"
        ctx.fillStyle = "lawngreen"
        ctx.fillText(`Score: ${this.score}`, 110, canvas.height - 20)
        //draw line across canvas
        ctx.beginPath();
        ctx.moveTo(0, 352)
        ctx.lineTo(300, 352)
        ctx.strokeStyle = 'lime'
        ctx.lineWidth = 3
        ctx.stroke()
    }
    drawSnake () {
        this.cells.forEach((cells) => {
            ctx.shadowColor = "none"
            ctx.shadowBlur = 0
            let snakeCell = new Image(this.width, this.height)
            snakeCell.src = 'images/snakeCells.jpg'
            ctx.drawImage(snakeCell, cells.x, cells.y, this.width, this.height)
    
            //snake collides with self
            let snakeHead = this.cells[0]
            let snakeTail = this.cells.slice(1)
    
            for (var i = 1; i < snakeTail.length; i++) {
    
                if (snakeHead.x === snakeTail[i].x && snakeHead.y === snakeTail[i].y) {
                    this.collision += 1
                    this.gameOver()  
                    setTimeout(() => {
                        location.reload()
                    }, 3000)
                }   
            }
            
        })
    }

}

//animation loop function
function animate () {
    requestAnimationFrame(animate)

    //slow game loop to 10 fps instead of 60 (60/10 = 6)
    if (++count < 6) {
        return
    }

    count = 0

    if (snake.collision > 0) {
        snake.gameOver()
    } else if (snake.collision < 1) {

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        snake.drawSnake()
        snake.drawScore()
        snake.drawApple()

        //move the snake 
        snake.x += snake.dirr
        snake.x -= snake.dirl
        snake.y += snake.dird
        snake.y -= snake.diru

        //boundaries of canvas for snake
        if (snake.x < 0) {
            snake.x = canvas.width 
        }
        else if (snake.x >= canvas.width) {
            snake.x = 0
        }

        if (snake.y < 0) {
            snake.y = 350 - snake.height
        }
        else if (snake.y + snake.height > 350) {
            snake.y = 0
        }

        // keep track of where snake has been. front of the array is always the head
        snake.cells.unshift({x: snake.x, y: snake.y})
        // remove cells as we move away from them
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop()
        }

        //collision with apple 
        if (snake.x + snake.width >= snake.appleX && 
            snake.y <= snake.appleY + snake.appleH &&
            snake.y + snake.height >= snake.appleY  &&
            snake.x < snake.appleX + snake.appleW) {
            snake.appleX = Math.floor(Math.random() * (1000 - 715))
            snake.appleY = Math.floor(Math.random() * (1000 - 665))
            snake.drawApple()
            snake.maxCells += 5
            snake.score++
        }

    }

}

// button eventlisteners
selectStart.addEventListener("click", function (e) {
    e.preventDefault()
    snake = new Snakegame()
    selectStart.disabled = true
    requestAnimationFrame(animate)
    
})

const selectLeft = document.querySelector("#left")
selectLeft.addEventListener("click", function (e) {
    e.preventDefault()
    snake.dirr = 0
    snake.dirl = 5
    snake.dird = 0
    snake.diru = 0

})

const selectRight = document.querySelector("#right")
selectRight.addEventListener("click", function (e) {
    e.preventDefault()
    snake.dirr = 5
    snake.dirl = 0
    snake.dird = 0
    snake.diru = 0

})

const selectUp = document.querySelector("#up")
selectUp.addEventListener("click", function (e) {
    e.preventDefault()
    snake.dirr = 0
    snake.dirl = 0
    snake.dird = 0
    snake.diru = 5

})

const selectDown = document.querySelector("#down")
selectDown.addEventListener("click", function (e) {
    e.preventDefault()
    snake.dirr = 0
    snake.dirl = 0
    snake.dird = 5
    snake.diru = 0

})

//touch eventlisteners

let startX
let startY

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault()
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    
})

canvas.addEventListener('touchend', function (e) {
    e.preventDefault()
    let endX = e.changedTouches[0].clientX
    let endY = e.changedTouches[0].clientY
    let resultX = endX - startX
    let resultY = endY - startY

    if (resultX < -50 && resultY < 30) {
        snake.dirr = 0
        snake.dirl = 5
        snake.dird = 0
        snake.diru = 0
    } else if(resultX > 50 && resultY < 30) {
        snake.dirr = 5
        snake.dirl = 0
        snake.dird = 0
        snake.diru = 0
    } else if(resultY < -50 && resultX < 30) {
        snake.dirr = 0
        snake.dirl = 0
        snake.dird = 0
        snake.diru = 5
    } else if (resultY > 50 && resultX < 30) {
        snake.dirr = 0
        snake.dirl = 0
        snake.dird = 5
        snake.diru = 0
    } else {
        return
    }

})