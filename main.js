import * as THREE from 'three';
import Food from './food';
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xFFFFFF, 0.8);
light.position.set(boardSize, 5, boardSize);
light.target.position.set(halfBoardSize, 0, halfBoardSize);
light.castShadow = true;
light.shadow.camera.left = -boardSize;
light.shadow.camera.right = boardSize;
light.shadow.camera.top = -boardSize;
light.shadow.camera.bottom = boardSize;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 15;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.bias = -0.01;
scene.add(light);
scene.add(light.target);

const segmentSize = 1;
const halfSegmentSize = segmentSize / 2;

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(boardSize, boardSize, boardSize, boardSize),
  new THREE.MeshStandardMaterial({ color: 0x70CC50, wireframe: false })
);
ground.receiveShadow = true;
ground.position.setX(halfBoardSize - halfSegmentSize);
ground.position.setY(-halfSegmentSize);
ground.position.setZ(halfBoardSize - halfSegmentSize);
ground.rotateX(-Math.PI / 2);
scene.add(ground);

const snake = new Snake(scene, segmentSize, halfBoardSize);
const food = new Food(scene, boardSize);
let score = 0;

function update() {
  renderer.render(scene, camera);

  snake.update(boardSize);
  if(snake.isEating(food.mesh)) {
    snake.grow(scene);
    food.createNew(boardSize);
    score++;
  }

  document.getElementById('score-display').innerText = score;

  food.update();

  requestAnimationFrame(update);
};

update();

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