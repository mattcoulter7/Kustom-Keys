import { Key } from './Key.js';

export class KeyTemplate{
    constructor(name,keys = []){
        this.name = name;
        this.keys = keys; // key names found under code on key event

        this.keyboard = null; // gets set from addTemplate
    }

    get actualKeys(){
        if (!this.keyboard) throw new Error("Template must be added to keyboard first")
        return this.keys.map(key => this.keyboard.getKey(Key._meshIdentifier + key)).filter(k => k)
    }
}