import * as KustomKeys from './modules/kustomkeys.mjs'
import * as AttachmentUtils from './third_party/AttachmentUtils/Attachment_utils.js'

window.addEventListener('load', function (e) {
    var keyboardScene = new KustomKeys.KeyboardScene(document.getElementById('test'));

    keyboardScene.loadKeyboard('/assets/models/rgb-keyboard/keyboard.glb', function (kb) {
        kb.addTemplate(
            new KustomKeys.KeyTemplate(
                'gamer',
                ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'Space', 'Escape']
            )
        );

        kb.templates.forEach(temp => {
            var templateButton = document.createElement('I')
            templateButton.id = 'btn-' + temp.name;
            templateButton.className = "fas fa-gamepad fa-5x";
            templateButton.addEventListener('click', function (e) {
                var keyboard = KustomKeys.KeyboardScene._get().keyboard;
                keyboard.toggleTemplate(e.target.id.replace(/btn-/, ""))
            })
            document.getElementById("buttons").appendChild(templateButton)
        })

        $.get(`/designs/data/${id.value}`, function (data) {
            KustomKeys.KeyboardScene._get().keyboard.stateHandler.loadState(data);
        })
    });

    $("#btn-color").colorPick({
        'initialColor': '#8e44ad',
        'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1"],
        'onColorSelected': function () {
            var keyboard = KustomKeys.KeyboardScene._get().keyboard;
            if (keyboard) {
                keyboard.setColor(this.color);
                keyboard.dropAll()
            }
        }
    });
    $("#btn-rise").on('click', function () {
        var keyboard = KustomKeys.KeyboardScene._get().keyboard
        if (keyboard.unappliedKeys.length == keyboard.selected.length || keyboard.unappliedKeys.length == 0)
            keyboard.riseAll()
        else
            keyboard.riseUnapplied()
    });
    $("#btn-drop").on('click', function () {
        KustomKeys.KeyboardScene._get().keyboard.dropAll()
    });
    $("#btn-undo").on('click', function () {
        KustomKeys.KeyboardScene._get().keyboard.stateHandler.undo();
    });
    $("#btn-redo").on('click', function () {
        KustomKeys.KeyboardScene._get().keyboard.stateHandler.redo();
    });
    $("#btn-download").on('click', function () {
        KustomKeys.KeyboardScene._get().download();
    });

    $("#save").submit(function (e) {
        var id = $('#id').val()

        var scene = KustomKeys.KeyboardScene._get()
        
        var title = $('#title').val()
        var keyboardURI = scene.renderer.domElement.toDataURL()

        var data = scene.keyboard.stateHandler.getState();

        uploadFile(keyboardURI,function(res){
            updateDesign(id,{
                title: title,
                thumbnailurl:res, 
                data: data
            })
        })

        return false;
    })
});

function updateDesign(id,values){
    $.ajax({
        url: `/designs/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(values),
        success: function (response) {
            console.log(response)
        }
    });
}

function uploadFile(dataURI,callback) {
    var convertedFile = AttachmentUtils.dataURItoFile(dataURI)

    var formData = new FormData();
    formData.set('file',convertedFile)
    $.ajax({
        url: '/file/upload',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: callback,
        error: function(error) {
            alert(error);
        }
    })
}