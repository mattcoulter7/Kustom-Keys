import { MouseMeshInteraction } from './../third_party/three_mmi-master/three_mmi.js';

import { Key } from './Key.js';
import { KeyboardStateHandler } from './KeyboardStateHandler.js';
import { KeyboardController } from './KeyboardController.js';

export class Keyboard {
    constructor(keyboardScene, gltf) {
        this.keyboardScene = keyboardScene;
        this.keys = [];
        this.scene = gltf.scene;
        this.meshes = gltf.scene.children;
        this.mmi = new MouseMeshInteraction(gltf.scene, this.keyboardScene.camera, keyboardScene.renderer.domElement)

        this.keyMeshes.forEach(m => this.addKey(m))
        this.templates = [];

        this.stateHandler = new KeyboardStateHandler(this)
        this.controller = new KeyboardController(this)
    }

    get keyMeshes() {
        return this.meshes.filter(m => m.name.startsWith(Key._meshIdentifier))
    }

    get actualKeys() { // keys that were keys and not keyboard body etc;
        if (this.keyMeshes.length == this.keys.length)
            return this.keys.filter(k => k.name.startsWith(Key._meshIdentifier)) // little bit faster
        return this.keyMeshes.map(m => this.getKey(m.name) || this.addKey(m))
    }

    // keys that have had something set to them already
    get appliedKeys() {
        return this.actualKeys.filter(k => k.applied)
    }
    // keys that haven't had something set to them already
    get unappliedKeys() {
        return this.actualKeys.filter(k => !k.applied)
    }
    // keys that are up
    get selected() {
        return this.keys.filter(k => k.state)
    }
    // keys that are down
    get nonSelected() { // this will create keys for every single key
        return this.actualKeys.filter(k => !k.state)
    }

    addTemplate(template){
        template.keyboard = this;
        this.templates.push(template)
    }
    getTemplate(templateName) {
        return this.templates.filter(t => t.name == templateName)[0];
    }
    toggleCollection(collection){
        var selectedKeys = this.selected;
        // if all of the keys are selected, then drop them
        if (collection.filter(k => selectedKeys.includes(k)).length == collection.length) { //if all of the template keys are risen
            collection.filter(k => k.state).forEach(k => k.toggle()) // drop the entire template
        } else {
            selectedKeys.filter(k => !collection.includes(k)).forEach(k => k.toggle()) // drop keys that aren't in template
            collection.filter(k => !k.state).forEach(k => k.toggle()) // rise template keys that haven't already been risen
        }
    }
    toggleTemplate(templateName) {
        var selectedKeys = this.selected;
        var template = this.getTemplate(templateName);
        if (!template) return;
        var templateKeys = template.actualKeys;
        this.toggleCollection(templateKeys)
    }
    toggleColor(color){
        var colorKeys = this.actualKeys.filter(k => k.baseColor == color);
        // if all of the keys are selected, then drop them
        this.toggleCollection(colorKeys)
    }

    addKey(mesh) { // keys get created from the mesh
        var key = new Key(this, mesh)
        this.keys.push(key);
        return key;
    }

    getKey(name) {
        return this.keys.filter(k => k.name == name)[0];
    }

    animate() {
        this.keys.forEach(key => key.animate())
    }

    dropAll() {
        this.selected.forEach(k => k.toggle())
    }

    riseAll() {
        this.nonSelected.forEach(k => k.toggle())
    }
    riseUnapplied() {
        this.unappliedKeys.filter(k => !k.state).forEach(k => k.toggle())
    }

    toggleKey(code) {
        var meshIdentifier = Key._getMeshIdentifier(code);

        var key = this.getKey(meshIdentifier);
        if (!key) {
            var mesh = this.meshes.filter(mesh => mesh.name == meshIdentifier)[0]
            if (!mesh) return; // no animations exists, can't be used
            key = this.addKey(mesh)
        }

        key.toggle();
    }

    // color is hexidecimal string
    setColor(color) {
        color = eval("0x" + color.substr(1))
        this.selected.forEach(k => {
            k.color = color;
            k.applied = true;
        })
        this.stateHandler.saveState()
    }
}