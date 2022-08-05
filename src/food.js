import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { randFloat } from 'three/src/math/MathUtils';

import apple_obj from "./assets/apple.obj";

export default class Food {
    constructor(scene, boardSize) {
        this.size = 0.5;
        this.animationProgress = 0;
        this.animationSpeed = 0.05;
        this.loaded = false;
        // this.mesh = Food.createMesh(this.size);

        const loader = new OBJLoader();
        loader.load(apple_obj, object => {
            console.log(object);
            this.mesh = object.children[0];
            this.mesh.rotateY(randFloat(0, Math.PI * 2));
            this.mesh.scale.set(0.3, 0.3, 0.3);
            
            this.mesh.material = [
                new THREE.MeshStandardMaterial({ color: 0xC7372F, flatShading: false }),
                new THREE.MeshStandardMaterial({ color: 0x6F4211, flatShading: false }),
                new THREE.MeshStandardMaterial({ color: 0x1DB10C, flatShading: false }),
            ]

            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            console.log(this.mesh);
            scene.add(this.mesh);
            this.createNew(boardSize, []);
        }, undefined, error => {
            console.error(error);
        });
    }

    static createMesh(size) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshStandardMaterial({ color: 0xFFFF00 })
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    createNew(boardSize, snakeSegments) {
        let newPos;
        let isColliding = false;

        do {
            const x = THREE.MathUtils.randInt(0, boardSize - 1);
            const z = THREE.MathUtils.randInt(0, boardSize - 1);
            newPos = new THREE.Vector3(x, 0, z);
            isColliding = this.isCollidingWithSnake(newPos, snakeSegments);
        } while (isColliding);

        this.mesh.position.copy(newPos);
        this.mesh.rotateY(randFloat(0, Math.PI * 2));
    }

    isCollidingWithSnake(pos, snakeSegments) {
        for (let seg of snakeSegments) {
            if (seg.distanceTo(pos) == 0) {
                console.log("get new pos");
                return true;
            }
        }
        return false;
    }

    update() {
        this.animationProgress += this.animationSpeed;
        if (this.animationProgress > Math.PI * 2) {
            this.animationProgress = 0;
        }

        this.mesh.position.setY(1 / 32 * Math.sin(this.animationProgress));
        this.mesh.rotateY(0.004);
    }
}