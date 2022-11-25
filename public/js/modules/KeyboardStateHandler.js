import {KeyboardState} from './KeyboardState.js'

export class KeyboardStateHandler{
    constructor(keyboard){
        this.keyboard = keyboard;
        this.undoQueue = [
            this.getState() // starts with history of initialisation
        ];
        this.redoQueue = [];
    }

    // creates a new json object of the current State
    getState(){
        return new KeyboardState(this.keyboard)
    }
    // loads json into keyboard
    loadState(state){
        if (state.keyStates)
            state.keyStates.forEach(state => this.keyboard.getKey(state.name).loadState(state))
    }
    // adds state into history for redirection
    saveState(){
        this.undoQueue.push(this.getState());
        this.redoQueue = []; // clear the redo Queue as new changes have been made
    }

    undo(){
        if (this.undoQueue.length == 0 || this.undoQueue.length == 1) 
            return console.log("Nothing left to undo");

        // splice last index of undoQueue and add it to the redo queue
        this.redoQueue.push(...this.undoQueue.splice(-1));
        this.reload();
    }
    redo(){
        if (this.redoQueue.length == 0) 
            return console.log("Nothing left to redo");

        // splice first index of redo queue and add it to undo queue
        this.undoQueue.push(...this.redoQueue.splice(-1));
        this.reload();
    }
    // reapplies the current state
    reload(){
        if (this.undoQueue.length == 0)
            this.saveState();
        this.loadState(this.undoQueue[this.undoQueue.length - 1]);
    }
}