import * as THREE from 'three';
import { Scene } from 'three';

export default class Food {
    constructor(scene, boardSize) {
        this.size = 1;
        this.mesh = Food.createMesh();
        scene.add(this.mesh);
        this.createNew(boardSize);
    }

    static createMesh() {
        return new THREE.Mesh(
            new THREE.BoxGeometry(this.size, this.size, this.size),
            new THREE.MeshStandardMaterial({ color: 0xFFFF00 })
        );
    }

    createNew(boardSize) {
        const x = THREE.MathUtils.randInt(0, boardSize - 1);
        const z = THREE.MathUtils.randInt(0, boardSize - 1);
        let newPos = new THREE.Vector3(x, 0, z);

        this.mesh.position.copy(newPos);
    }
}