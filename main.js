import * as THREE from 'three';
import Snake from './snake';

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

const snake = new Snake(scene, segmentSize, halfBoardSize);

let food;
createNewFood();

function update() {
  renderer.render(scene, camera);

  // console.log(snake.newHeading);
  snake.update();
  if(snake.isEating(scene, food)) {
    createNewFood();
  }

  requestAnimationFrame(update);
};

update();

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

  if (h.x != snake.segments[0].heading.x * -1 || h.z != snake.segments[0].heading.z * -1) {
    snake.newHeading = h;
  }
})