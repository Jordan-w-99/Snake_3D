import * as THREE from 'three';

export default class Snake {
    constructor(scene, segmentSize, halfBoardSize) {
        this.segments = []; // array of coordinates & headings, only get incremented in units of 1
        this.mesh = []; // array of mesh objects, position these using snake array, heading & progress
        this.animationProgress = 0;
        this.newHeading = new THREE.Vector3(0, 0, 0);
        this.segmentSize = segmentSize;

        const head = new THREE.Vector3(Math.floor(halfBoardSize), 0, Math.floor(halfBoardSize));
        head.heading = new THREE.Vector3(0, 0, 0);
        this.segments.push(head);
        this.createSegment(scene);
    }

    update() {
        this.animationProgress += 0.05;
        if (this.animationProgress > 1) {
            this.shiftSnake();
            this.animationProgress = 0;
        }

        this.updateSnakeMesh();
    }

    updateSnakeMesh() {
        for (let i = 0; i <= this.mesh.length - 1; i++) {
            const xPos = this.segments[i].x + this.segments[i].heading.x * this.animationProgress;
            const zPos = this.segments[i].z + this.segments[i].heading.z * this.animationProgress;
            this.mesh[i].position.setX(xPos);
            this.mesh[i].position.setZ(zPos);
        }
    }

    shiftSnake() {
        const newSegments = this.segments;
        for (let i = this.segments.length - 1; i >= 1; i--) {
            newSegments[i].x = newSegments[i - 1].x;
            newSegments[i].z = newSegments[i - 1].z;
            newSegments[i].heading.copy(newSegments[i - 1].heading);
        }

        newSegments[0].x += newSegments[0].heading.x;
        newSegments[0].z += newSegments[0].heading.z;

        this.segments = newSegments;
        this.segments[0].heading.copy(this.newHeading);
    }

    isEating(food) {
        return (this.segments[0].distanceTo(food.position) < 0.1);
    }

    grow(scene) {
        const newSegment = (new THREE.Vector3()).copy(this.segments[this.segments.length - 1]);
        newSegment.heading = (new THREE.Vector3()).copy(this.segments[this.segments.length - 1].heading);
        this.segments.push(newSegment);
        this.createSegment(scene);
    }

    createSegment(scene) {
        const segment = new THREE.Mesh(
            new THREE.BoxGeometry(this.segmentSize, this.segmentSize, this.segmentSize),
            new THREE.MeshStandardMaterial({ color: 0xFF0000 })
        );
        this.mesh.push(segment);
        scene.add(segment);
    }
}