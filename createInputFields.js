function createInputFields(emptyInputs, appendInElement, mp3ValidationElement) {
    if (emptyInputs) {
        alert('Cant add fields when other still empty');
        return;
    }
    var inputIndex = $('.songInput-wrapper').length;
    $(appendInElement).append(`<div class="songInput-wrapper"> 
            Song URL
            <input type="text" id='song` + `${inputIndex+1}` + `Url' class='inputUrl' "/>
             Name
            <input type="text" id='song` + `${inputIndex+1}` + `Name' class='inputName' "/><br /><br />
            </div>
        `);
    isItMp3(mp3ValidationElement);
}