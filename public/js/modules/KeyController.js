export class KeyController{
    // #region Event Handlers
    constructor(key){
        this.key = key;

        key.keyboard.mmi.addHandler(key.mesh.name, 'click', this)
        key.keyboard.mmi.addHandler(key.mesh.name, 'dblclick', this)
        key.keyboard.mmi.addHandler(key.mesh.name, 'contextmenu', this)
        key.keyboard.mmi.addHandler(key.mesh.name, 'mouseenter', this)
        key.keyboard.mmi.addHandler(key.mesh.name, 'mouseleave', this)

        this.enabled = true;

        this.extraEvents = {
            'click':[],
            'dblclick':[],
            'contextmenu':[],
            'mouseenter':[],
            'mouseleave':[],
        }
    }

    mouseenter(event, mesh) {
        mesh.material.color.setHex(0xffffff); // access directly as doesn't save base color
        this.extraEvents['mouseenter'].forEach(f => f(this))
    }

    mouseleave(event, mesh) {
        this.key.color = this.key.baseColor;
        this.extraEvents['mouseleave'].forEach(f => f(this))
    }

    click(event) {
        console.log(this.key.name)
        this.key.toggle()
        this.extraEvents['click'].forEach(f => f(this))
    }
    dblclick(event) {
        this.key.keyboard.toggleColor(this.key.baseColor)
        this.extraEvents['dblclick'].forEach(f => f(this))
    }

    contextmenu(event, mesh) {
        this.key.keyboard.toggleColor(this.key.baseColor)
        this.extraEvents['contextmenu'].forEach(f => f(this))
    }

    handleEvent(event, mesh) {
        if (!this.enabled) return;
        var type = typeof event === "string" ? event : event.type;
        try {
            this[type](event, mesh)
        } catch (e) {
            console.log(e)
        }
    }

    addHandler(event,func){
        if (!this.extraEvents[event]) throw new Error("event: " + event + " is not a valid method. Only use " + Object.keys(this.extraEvents).join(";"))
        this.extraEvents[event].push(func)
    }
}