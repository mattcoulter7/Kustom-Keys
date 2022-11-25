import * as THREE from '/node_modules/three/build/three.module.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { Keyboard } from './Keyboard.js';

export class KeyboardScene {
    constructor(container = document.body) {
        $(document).data('keyboardScene', this)
        this.keyboard = null;

        this.container = container;
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            preserveDrawingBuffer: true 
        });
        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(this.width, this.height);
        container.appendChild(this.renderer.domElement);

        this.addLights();

        this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 1, 1000);
        this.camera.position.set(3, 3, 3);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.loader = new GLTFLoader();

        window.addEventListener('resize', this.constructor._resize);
        this.update()
    }

    get width() {
        return Number(window.getComputedStyle(this.container, null).getPropertyValue("width").replace(/px/, "")) || window.innerWidth;
    }

    get height() {
        return Number(window.getComputedStyle(this.container, null).getPropertyValue("height").replace(/px/, "")) || window.innerHeight;
    }

    addLights() {
        // lights
        const dirLight1 = new THREE.DirectionalLight(0xffffff);
        dirLight1.position.set(1, 1, 1);
        this.scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0x002288);
        dirLight2.position.set(-1, -1, -1);
        this.scene.add(dirLight2);

        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
    }

    update() {
        if (this.keyboard) {
            this.keyboard.animate();
            this.keyboard.mmi.update();
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.constructor._update);
    }

    loadKeyboard(url,callback) {
        this.loader.load(url, (gltf) => {
            console.log(gltf)
            this.scene.add(gltf.scene)
            this.keyboard = new Keyboard(this, gltf);
            if (typeof callback === "function"){
                callback(this.keyboard)
            }
        }, undefined, (error) => {
            console.error(error);
        });
    }

    // #region Event Handlers

    resize() {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    eventHandler(event) {
        try {
            this[event.type](event)
        } catch (e) {
            console.error(e)
        }
    }

    download(){
        var url = this.renderer.domElement.toDataURL();
        var link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('target', '_blank');
        link.setAttribute('download', "test");
    
        link.click();
    }

    // recursive function to take camera through multiple points and save photos. Return thumbnails which is collection of baseuris
    // desintation should be {x:...,y:...,z:...}
    photoshoot(destination = {},following = [],thumbnails = []){
        var following = Array.from(arguments)
        var destination = params.splice(0,1)[0]
        var thumbnails = Array.isArray(params[params.length - 1]) ? params.splice(-1)[0] : []; // will be created on first time but referenced on following

        const coords = { x: camera.position.x, y: camera.position.y,z: camera.position.z};
        new TWEEN.Tween(coords)
        .to(destination)
        .onUpdate(() =>
            this.camera.position.set(coords.x, coords.y, coords.z)
        )
        .onComplete(() => {
            thumbnails.push(this.renderer.domElement.toDataURL())
            if (following.length > 0)
                this.photoshoot(following.splice(0,1),following,thumbnails)
            else
                return thumbnails
        })
        .start();
    }

    //#endregion

    static _get() {
        return $(document).data('keyboardScene');
    }
    static _update() {
        // this is not defined from window animation, need to call global first
        KeyboardScene._get().update();
    }
    static _resize() {
        // this is not defined from window animation, need to call global first
        KeyboardScene._get().resize();
    }
}