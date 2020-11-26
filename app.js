const app = document.querySelector('.app')

const newElement = str => {
	const tag = str.split('.')[0] || 'div'
	const className = str.split('.')[1]

	const element = document.createElement(tag)
	className && element.classList.add(className)

	return element
}

const title = newElement('h1')
title.innerHTML = 'Snaek is Frend'

const game = newElement('.game')

const gridSize = 16

const grid = size => {
	const element = newElement('.grid')

	const generateGrid = size => {
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				const block = newElement('.block')
				block.setAttribute('x', `${j}`)
				block.setAttribute('y', `${i}`)
				block.setAttribute('s', `empty`)
				element.appendChild(block)
			}
		}
	}

	generateGrid(size)

	return element
}

const snake = []
let direction = 'right'

const changeDirection = e => {
	if (e.key === 'ArrowLeft' || e.key === 'a') direction = 'left'
	if (e.key === 'ArrowRight' || e.key === 'd') direction = 'right'
	if (e.key === 'ArrowUp' || e.key === 'w') direction = 'up'
	if (e.key === 'ArrowDown' || e.key === 's') direction = 'down'
}

const food = () => {
	const x = Math.floor(Math.random() * gridSize)
	const y = Math.floor(Math.random() * gridSize)
	const newFood = game.querySelector(`[x="${x}"][y="${y}"]`)

	if (newFood.classList.contains('snake')) food()
	else newFood.classList.add('food')
}

const Snake = () => {
	const drawSnake = (snake, old) => {
		snake && snake.forEach(block => block.classList.add('snake'))
		old && old.classList.remove('snake')
	}

	const checkCollision = (x, y) => {
		const nextBlock = game.querySelector(`[x="${x}"][y="${y}"]`)
		// Walls and self
		if (nextBlock && !nextBlock.classList.contains('snake')) {
			return true
		}
		return false
	}

	const checkFood = (x, y) => {
    const nextBlock = game.querySelector(`[x="${x}"][y="${y}"]`)
		if (nextBlock.classList.contains('food')) {
			nextBlock.classList.remove('food')
			food()
			pace += 1 / (pace * 5)
			return true
		}
	}

	const moveSnake = () => {
		let x = parseInt(snake[0].getAttribute('x'))
		let y = parseInt(snake[0].getAttribute('y'))

		if (direction === 'left') x--
		if (direction === 'right') x++
		if (direction === 'up') y--
		if (direction === 'down') y++

		if (checkCollision(x, y)) {
			const newBlock = () => game.querySelector(`[x="${x}"][y="${y}"]`)
			snake.unshift(newBlock())
      if (!checkFood(x, y)) Snake().drawSnake(snake, snake.pop())
      else Snake().drawSnake(snake)
		}
	}

	return { snake, drawSnake, moveSnake }
}

app.appendChild(title)
app.appendChild(game)
game.appendChild(grid(gridSize))

const getBlock = (x, y) => game.querySelector(`[x="${x}"][y="${y}"]`)

snake.unshift(getBlock(0, 0))
snake.unshift(getBlock(1, 0))
snake.unshift(getBlock(2, 0))

Snake().drawSnake(snake)

food()

const input = () => window.addEventListener('keydown', changeDirection)

let pace = 5

input()

const repeat = () => {
	Snake().moveSnake()

	setTimeout(repeat, (1 / pace) * 1000)
}

repeat()

/*-------------------------------------------------------------------------------------------------------------------*/

// let i = 1

// const repeat = () => {
// 	app.innerHTML = i++
// 	pace += 1 / (pace * 10)
// 	setTimeout(repeat, (1 / pace) * 1000)
// }

// repeat()
