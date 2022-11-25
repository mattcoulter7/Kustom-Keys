export class KeyboardState{
    constructor(keyboard){
        // save key data
        this.keyStates = keyboard.keys.map(key => key.getState())
    }
}