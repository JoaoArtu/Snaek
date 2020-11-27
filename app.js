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
app.appendChild(title)

const playBtn = newElement('.play')
const btn = newElement('a.btn')
playBtn.innerHTML = 'Play'
btn.appendChild(playBtn)
app.appendChild(btn)

const howTo = newElement('p.how-to')
howTo.innerHTML = 'You can use either WASD or arrows to change direction'
app.appendChild(howTo)

const game = newElement('.game')
const gridSize = 12
app.appendChild(game)

const score = newElement('.score')
score.innerHTML = 0
app.appendChild(score)

const grid = size => {
	const element = newElement('.grid')
	element.style.gridTemplateColumns = `repeat(${size}, 1fr)`
	element.style.gridTemplateRows = `repeat(${size}, 1fr)`

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

game.appendChild(grid(gridSize))

const snake = []
let direction = 'right'

const food = () => {
	const x = Math.floor(Math.random() * gridSize)
	const y = Math.floor(Math.random() * gridSize)
	const newFood = game.querySelector(`[x="${x}"][y="${y}"]`)

	if (newFood.classList.contains('snake')) food()
	else newFood.classList.add('food')
}

const Snake = () => {
	const drawSnake = remove => {
		snake && snake.forEach(block => block.classList.add('snake'))
		remove && snake.pop().classList.remove('snake')
	}

	const changeDirection = e => {
		if ((e.key === 'ArrowLeft' || e.key === 'a') && direction !== 'right') direction = 'left'
		else if ((e.key === 'ArrowRight' || e.key === 'd') && direction !== 'left') direction = 'right'
		else if ((e.key === 'ArrowUp' || e.key === 'w') && direction !== 'down') direction = 'up'
		else if ((e.key === 'ArrowDown' || e.key === 's') && direction !== 'up') direction = 'down'
	}
	const checkCollision = (x, y) => {
		const nextBlock = game.querySelector(`[x="${x}"][y="${y}"]`)
		if (nextBlock && !nextBlock.classList.contains('snake')) return true
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
			if (!checkFood(x, y)) Snake().drawSnake(true)
			else {
				Snake().drawSnake()
				score.innerHTML++
			}
		}
	}

	return { drawSnake, moveSnake, checkCollision, checkFood, changeDirection }
}

const getBlock = (x, y) => game.querySelector(`[x="${x}"][y="${y}"]`)

snake.unshift(getBlock(0, 0))
snake.unshift(getBlock(0, 0))
snake.unshift(getBlock(0, 0))

Snake().drawSnake()

food()

const checkInput = () => window.addEventListener('keydown', Snake().changeDirection)
checkInput()

let pace = 10

const repeat = () => {
	Snake().moveSnake()

	setTimeout(repeat, (1 / pace) * 1000)
}

repeat()
