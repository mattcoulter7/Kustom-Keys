import * as THREE from '/node_modules/three/build/three.module.js';
import {KeyController} from './KeyController.js'

export class Key {
    constructor(keyboard, mesh) {
        mesh.material = new THREE.MeshStandardMaterial() // need to ensure materials are independent of other materials

        this.mesh = mesh;
        this.color = 0xD3D3D3

        this.keyboard = keyboard;
        this.state = false; // false is down, up is true
        this.animationInProgress = false;
        this.minY = this.y;
        this.applied = false;

        this.controler = new KeyController(this)

        this.KEY_RISE_SCALE = 1.4; // rises by 3 times of original height
        this.KEY_RISE_RATE = 1.09;
    }

    get y() {
        return this.mesh.position.y;
    }
    get maxY() {
        return this.minY * this.KEY_RISE_SCALE;
    }
    set y(val) {
        this.mesh.position.y = val;
    }

    get name() {
        return this.mesh.name;
    }

    toggle() {
        if (this.animationInProgress) return; // can't change whilst it is moving
        this.state = !this.state;
        this.startAnimation();
    }

    startAnimation() {
        this.animationInProgress = true;
    }

    stopAnimation() {
        this.animationInProgress = false;
    }

    animate() {
        if (!this.animationInProgress) return;

        if (this.state) { // moving upwards
            if (this.y < this.maxY) {
                this.y *= this.KEY_RISE_RATE;
            } else { // end has been reached
                this.y = this.maxY; // temporary fix, need to find a better way for key flow from bottom to top etc.
                this.stopAnimation();
            }
        } else { // moving downwards
            if (this.y > this.minY) {
                this.y /= this.KEY_RISE_RATE;
            } else { // end has been reached
                this.y = this.minY;
                this.stopAnimation();
            }
        }
    }

    get color() {
        return this.mesh.material.color.getHex();
    }
    set color(hex) {
        this.baseColor = hex;
        this.mesh.material.color.setHex(hex);
    }

    getState(){
        return {
            name:this.name, // store name for reference
            color:this.color,
            state: this.state,
            applied:this.applied
        }
    }
    loadState(state){
        this.color = state.color;
        this.applied = state.applied;
        if (this.state != state.state)
            this.toggle();
    }

    // #endregion

    static get _meshIdentifier() {
        return "KEY_";
    }

    static _getMeshIdentifier(code) {
        if (code.startsWith(this._meshIdentifier)) return code;
        return this._meshIdentifier + code
    }
}