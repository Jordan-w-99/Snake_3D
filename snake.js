import * as THREE from 'three';

export default class Snake {
    constructor(scene, segmentSize, halfBoardSize) {
        this.segments = []; // array of coordinates & headings, only get incremented in units of 1
        this.mesh = []; // array of mesh objects, position these using snake array, heading & progress
        this.animationProgress = 0;
        this.newHeading = new THREE.Vector3(0, 0, 0);
        this.segmentSize = segmentSize;
        this.speed = 0.04;
        this.maxSpeed = 0.2;
        this.speedRate = 0.0025;

        const head = new THREE.Vector3(Math.floor(halfBoardSize), 0, Math.floor(halfBoardSize));
        head.heading = new THREE.Vector3(0, 0, 0);
        this.segments.push(head);
        this.createSegment(scene, head);

        this.isEatingSelf = false;
    }

    update(boardSize) {
        this.animationProgress += this.speed;
        if (this.animationProgress > 1) {
            this.isEatingSelf = this.shiftSnake(boardSize);
            this.animationProgress = 0;
        }

        this.updateSnakeMesh();
    }

    updateSnakeMesh() {
        const headXPos = this.segments[0].x + this.segments[0].heading.x * this.animationProgress;
        const headZPos = this.segments[0].z + this.segments[0].heading.z * this.animationProgress;
        this.mesh[0].position.setX(headXPos);
        this.mesh[0].position.setZ(headZPos);

        // check if is off edge, or eating self here
        // if (this.isEatingSelf(head) || this.isOutOfBounds(newSegments, boardSize)) {
        //     return true;
        // }

        if (this.mesh.length > 1) {
            const tailIndex = this.mesh.length - 1;
            const tailXPos = this.segments[tailIndex - 1].x + this.segments[tailIndex - 1].heading.x * this.animationProgress;
            const tailZPos = this.segments[tailIndex - 1].z + this.segments[tailIndex - 1].heading.z * this.animationProgress;
            this.mesh[tailIndex].position.setX(tailXPos);
            this.mesh[tailIndex].position.setZ(tailZPos);
        }

        for (let i = 1; i <= this.mesh.length - 2; i++) {
            const zPos = this.segments[i].z + this.segments[i].heading.z;
            const xPos = this.segments[i].x + this.segments[i].heading.x;
            this.mesh[i].position.setX(xPos);
            this.mesh[i].position.setZ(zPos);
        }
    }

    shiftSnake(boardSize) {
        const newSegments = this.segments;
        for (let i = this.segments.length - 1; i >= 1; i--) {
            newSegments[i].x = newSegments[i - 1].x;
            newSegments[i].z = newSegments[i - 1].z;
            newSegments[i].heading.copy(newSegments[i - 1].heading);
        }

        newSegments[0].x += newSegments[0].heading.x;
        newSegments[0].z += newSegments[0].heading.z;

        if (this.eatingSelf(newSegments) || this.isOutOfBounds(newSegments, boardSize)) {
            return true;
        }

        this.segments = newSegments;
        this.segments[0].heading.copy(this.newHeading);
    }

    isOutOfBounds(newSegments, boardSize) {
        return (
            newSegments[0].x < 0 ||
            newSegments[0].x >= boardSize ||
            newSegments[0].z < 0 ||
            newSegments[0].z >= boardSize
        )
    }

    isEating(food) {
        return (this.segments[0].distanceTo(food.position) < 0.1);
    }

    eatingSelf(newSegments) {
        if (newSegments.length > 2) {
            for (let i = 1; i < newSegments.length; i++) {
                if (newSegments[i].distanceTo(newSegments[0]) == 0) {
                    return true;
                }
            }
        }
        return false;
    }

    grow(scene) {
        const newSegment = (new THREE.Vector3()).copy(this.segments[this.segments.length - 1]);
        newSegment.heading = (new THREE.Vector3()).copy(this.segments[this.segments.length - 1].heading);
        this.segments.push(newSegment);
        this.createSegment(scene, newSegment);

        if (this.speed < this.maxSpeed) {
            this.speed += this.speedRate;
        }
    }

    createSegment(scene, newSegment) {
        const segment = new THREE.Mesh(
            new THREE.BoxGeometry(this.segmentSize, this.segmentSize, this.segmentSize),
            new THREE.MeshStandardMaterial({ color: 0xFF0000 })
        );
        segment.geometry.computeBoundingBox();
        segment.position.copy(newSegment);
        segment.castShadow = true;
        segment.receiveShadow = true;
        this.mesh.push(segment);
        scene.add(segment);
    }
}