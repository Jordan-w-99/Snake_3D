import * as THREE from 'three';
import { Vector3 } from 'three';

const scene = new THREE.Scene();

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 8;

const boardSize = 9;
const halfBoardSize = boardSize / 2

const camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000);
camera.position.setZ(10);
camera.position.setX(3);
camera.position.setY(3);
camera.lookAt(new THREE.Vector3(halfBoardSize, 0, halfBoardSize));
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 1);
pointLight.position.copy(camera.position);
scene.add(pointLight);

const segmentSize = 1;
const halfSegmentSize = segmentSize / 2;

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(boardSize, boardSize, boardSize, boardSize),
  new THREE.MeshStandardMaterial({ color: 0x70CC50, wireframe: true })
);
ground.position.setX(halfBoardSize - halfSegmentSize);
ground.position.setY(-halfSegmentSize);
ground.position.setZ(halfBoardSize - halfSegmentSize);
ground.rotateX(-Math.PI / 2);
scene.add(ground);

let snake = []; // array of coordinates & headings, only get incremented in units of 1
let snakeMesh = []; // array of mesh objects, position these using snake array, heading & progress

const head = new THREE.Vector3(Math.floor(halfBoardSize), 0, Math.floor(halfBoardSize));
head.heading = new THREE.Vector3(0, 0, 0);
snake.push(head);
createSegment();

let food;
createNewFood();

let newHeading = new THREE.Vector3(0, 0, 0);
let progress = 0;

function update() {
  renderer.render(scene, camera);


  progress += 0.05;
  if (progress > 1) {
    shiftSnake();
    progress = 0;
  }

  updateSnakeMesh();

  isEating();

  requestAnimationFrame(update);
};

update();

function updateSnakeMesh() {
  for (let i = 0; i <= snakeMesh.length - 1; i++) {
    const xPos = snake[i].x + snake[i].heading.x * progress;
    const zPos = snake[i].z + snake[i].heading.z * progress;
    snakeMesh[i].position.setX(xPos);
    snakeMesh[i].position.setZ(zPos);
  }
}

function shiftSnake() {
  const newSegments = snake;
  for (let i = snake.length - 1; i >= 1; i--) {
    newSegments[i].x = newSegments[i - 1].x;
    newSegments[i].z = newSegments[i - 1].z;
    newSegments[i].heading.copy(newSegments[i - 1].heading);
  }

  newSegments[0].x += newSegments[0].heading.x;
  newSegments[0].z += newSegments[0].heading.z;

  snake = newSegments;
  snake[0].heading.copy(newHeading);
}

function isEating() {
  if (snake[0].distanceTo(food.position) < 0.1) {
    createNewFood();
    growSnake();
  }
}

function createNewFood() {
  const x = THREE.MathUtils.randInt(0, boardSize - 1);
  const z = THREE.MathUtils.randInt(0, boardSize - 1);
  let newPos = new THREE.Vector3(x, 0, z);

  const newFood = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xFFFF00 })
  );
  newFood.position.copy(newPos);
  scene.remove(food);
  food = newFood;
  scene.add(newFood);
}

function growSnake() {
  const newSegment = (new THREE.Vector3()).copy(snake[snake.length - 1]);
  // newSegment.sub(snake[snake.length - 1].heading)
  newSegment.heading = (new Vector3()).copy(snake[snake.length - 1].heading);
  snake.push(newSegment);
  createSegment();
}

function createSegment() {
  const segment = new THREE.Mesh(
    new THREE.BoxGeometry(segmentSize, segmentSize, segmentSize),
    new THREE.MeshStandardMaterial({ color: 0xFF0000 })
  );
  snakeMesh.push(segment);
  scene.add(segment);
}

window.addEventListener('keypress', e => {
  let h;

  switch (e.key) {
    case 'w':
      h = new THREE.Vector3(0, 0, -1);
      break;

    case 'a':
      h = new THREE.Vector3(-1, 0, 0);
      break;

    case 's':
      h = new THREE.Vector3(0, 0, 1);
      break;

    case 'd':
      h = new THREE.Vector3(1, 0, 0);
      break;
  }

  if (h.x != snake[0].heading.x * -1 || h.z != snake[0].heading.z * -1) {
    newHeading = h;
  }
})