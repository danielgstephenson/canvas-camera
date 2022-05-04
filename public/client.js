const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
canvas.imageSmoothingEnabled = false

// Disable Right Click Menu
document.oncontextmenu = () => false

const range = n => [...Array(n).keys()]
const clamp = (a, b, x) => Math.min(b, Math.max(a, x))
const clone = x => JSON.parse(JSON.stringify(x))
const sqr = x => x * x
const sqrt = Math.sqrt
const max = Math.max
const min = Math.min
const abs = Math.abs
const exp = Math.exp
const sin = Math.sin
const sign = Math.sign
const floor = Math.floor
const runif = (a = 0, b = 1) => a + Math.random() * (b - a)
const sum = x => x.reduce((a, b) => a + b)
const mean = x => x.length > 0 ? sum(x) / x.length : 0
const dist = (a, b) => sqrt(sqr(a.x - b.x) + sqr(a.y - b.y))

const pi = Math.PI
const dt = 0.05
const mouseDown = [false, false, false]
const camera = { x: 0, y: 0, zoom: 0, scale: 1 }
const controls = [
  { key: 'w', input: 'up' },
  { key: 's', input: 'down' },
  { key: 'a', input: 'left' },
  { key: 'd', input: 'right' }
]
const inputs = {
  up: false,
  down: false,
  left: false,
  right: false
}

const walls = [
  [
    { x: -45, y: 45 },
    { x: 45, y: 45 },
    { x: 45, y: -45 },
    { x: -45, y: -45 },
    { x: -45, y: 45 }
  ]
]
const player = { x: 0, y: 0, dx: 0, dy: 0 }

window.onmousemove = function (e) {
  if (mouseDown[2]) {
    camera.x += e.movementX / camera.scale
    camera.y += e.movementY / camera.scale
  }
}

window.onwheel = function (e) {
  camera.zoom += -e.deltaY * 0.001
}

window.onmousedown = function (e) {
  mouseDown[e.button] = true
  console.log(player)
}

window.onmouseup = function (e) {
  mouseDown[e.button] = false
}

window.onkeydown = function (e) {
  controls.forEach(c => { if (e.key === c.key) inputs[c.input] = true })
}

window.onkeyup = function (e) {
  controls.forEach(c => { if (e.key === c.key) inputs[c.input] = false })
}

function update () {
  const force = 10
  player.dx += inputs.right ? force * dt : 0
  player.dx += inputs.left ? -force * dt : 0
  player.dy += inputs.up ? -force * dt : 0
  player.dy += inputs.down ? force * dt : 0
  player.x += player.dx * dt
  player.y += player.dy * dt
}

function drawWalls () {
  context.strokeStyle = 'rgb(100,100,100)'
  context.lineWidth = 2
  context.lineJoin = 'round'
  context.lineCap = 'round'
  walls.forEach(wall => {
    context.beginPath()
    context.moveTo(wall[0].x, wall[0].y)
    range(wall.length - 1).forEach(i => {
      const x = wall[i + 1].x
      const y = wall[i + 1].y
      context.lineTo(x, y)
    })
    context.stroke()
  })
}

function drawPlayer () {
  context.fillStyle = 'rgb(0,0,200)'
  context.beginPath()
  context.arc(player.x, player.y, 5, 0, 2 * pi)
  context.fill()
}

function setupCanvas () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const minDim = min(canvas.height, canvas.width)
  camera.scale = minDim / 100 * exp(camera.zoom)
  context.translate(canvas.width / 2, canvas.height / 2)
  context.scale(camera.scale, camera.scale)
  context.translate(camera.x, camera.y)
  context.imageSmoothingEnabled = false
}

function draw () {
  window.requestAnimationFrame(draw)
  setupCanvas()
  drawWalls()
  drawPlayer()
}

draw()
setInterval(update, dt * 1000)
