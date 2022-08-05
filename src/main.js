import * as THREE from 'three';
import Food from './food';
import Snake from './snake';

const scene = new THREE.Scene();

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 15;

const boardSize = frustumSize;
const halfBoardSize = boardSize / 2

const camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000);
camera.position.setZ(boardSize - 0.5);
camera.position.setX(-0.5);
camera.position.setY(halfBoardSize);
camera.lookAt(new THREE.Vector3(halfBoardSize - 0.5, 0, halfBoardSize - 0.5));

// const cameraHelper = new THREE.CameraHelper(camera);
// scene.add(cameraHelper);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xFFFFFF, 0.5);
light.position.set(boardSize - boardSize/3, boardSize/2, boardSize - boardSize/3);
light.target.position.set(halfBoardSize, 0, halfBoardSize);
light.castShadow = true;
light.shadow.camera.left = -boardSize;
light.shadow.camera.right = boardSize;
light.shadow.camera.top = -boardSize;
light.shadow.camera.bottom = boardSize;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = boardSize;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.bias = -0.01;
// const lightHelper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(lightHelper);
scene.add(light);
scene.add(light.target);

const segmentSize = 1;
const halfSegmentSize = segmentSize / 2;

const textureLoader = new THREE.TextureLoader();
const textureCube = [
  new THREE.MeshBasicMaterial({
    color: 0x000000
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("./assets/dirt.png") // X- (VISIBLE LEFT)
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("./assets/grass.png"), // Z+ (VISIBLE TOP)
  }),
  new THREE.MeshBasicMaterial({
    color: 0x000000
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load("./assets/dirt.png") // Y- (VISIBLE RIGHT)
  }),
  new THREE.MeshBasicMaterial({
    color: 0x000000
  }),
];

const ground = new THREE.Mesh(
  new THREE.BoxGeometry(boardSize, boardSize, boardSize, boardSize),
  textureCube
);
// new THREE.MeshStandardMaterial({ wireframe: false, map: textureCube })
ground.receiveShadow = true;
ground.position.setX(halfBoardSize - halfSegmentSize);
ground.position.setY(-halfSegmentSize - halfBoardSize);
ground.position.setZ(halfBoardSize - halfSegmentSize);
// ground.rotateX(-Math.PI / 2);
scene.add(ground);

let snake;
let food;
let score;
let paused = true;

function setupGame() {
  snake = new Snake(scene, segmentSize, halfBoardSize);
  food = new Food(scene, boardSize);
  score = 0;
}

// setup buttons
document.getElementById('play-btn').onclick = playPressed;

function playPressed() {
  paused = false;
  document.getElementById("menu-screen").style.display = 'none';
}

setupGame();
update();

function update() {
  renderer.render(scene, camera);

  if (!paused) {

    snake.update(boardSize);
    if (snake.isEating(food.mesh)) {
      snake.grow(scene);
      if (score < boardSize * boardSize) {
        food.createNew(boardSize, snake.segments);
      } else {
        console.log("you win");
        paused = true;
      }
      score++;
      document.getElementById('score-display').innerText = score;
    }

    if (snake.isEatingSelf) {
      console.log("you lose");
      paused = true;
    }


    food.update();

  }

  requestAnimationFrame(update);
};

window.addEventListener('keydown', e => {
  let h;

  if (snake.mesh.length == 1) {
    snake.grow(scene);
  }

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

    case 'r':
      paused = false;
      removeMeshes();
      setupGame();
      break;

    case 'Escape':
      console.log("pausing");
      if (!paused) {
        paused = true;
        document.getElementById("pause-screen").style.display = 'flex';
      } else {
        paused = false
        document.getElementById("pause-screen").style.display = 'none';
      }
      break;
  }



  function removeMeshes() {
    scene.remove(food.mesh);

    for (let seg of snake.mesh) {
      scene.remove(seg);
    }
  };

  if (h) {
    if (h.x != snake.segments[0].heading.x * -1 || h.z != snake.segments[0].heading.z * -1) {
      snake.newHeading = h;
    }
  }
})