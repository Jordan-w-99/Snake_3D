import * as THREE from 'three';
import { Scene } from 'three';

export default class Food {
    constructor(scene, boardSize) {
        this.size = 0.5;
        this.animationProgress = 0;
        this.animationSpeed = 0.05;
        this.mesh = Food.createMesh(this.size);
        scene.add(this.mesh);
        this.createNew(boardSize);
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

    createNew(boardSize) {
        const x = THREE.MathUtils.randInt(0, boardSize - 1);
        const z = THREE.MathUtils.randInt(0, boardSize - 1);
        let newPos = new THREE.Vector3(x, 0, z);

        this.mesh.position.copy(newPos);
    }

    update() {
        this.animationProgress += this.animationSpeed;
        if(this.animationProgress > Math.PI * 2) {
            this.animationProgress = 0;
        }

        this.mesh.position.setY(1/32 * Math.sin(this.animationProgress));
    }
}