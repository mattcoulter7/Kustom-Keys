export class KeyboardController{
    constructor(keyboard){
        this.keyboard = keyboard;
        document.addEventListener('keyup', this);

        this.enabled = true;
    }

    // #region Event Handlers

    keyup(event) {
        console.log(event.code)
        event.preventDefault();
        this.keyboard.toggleKey(event.code);
    }

    handleEvent(event) {
        if (!this.enabled) return;
        try {
            this[event.type](event)
        } catch (e) {
            console.error(e)
        }
    }

    // #endregion
}