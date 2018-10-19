function strict_cantAddFieldsIfOthersEmpty(emptyInputs , modalBodyContainer , elementButtonId ){

    var padre = modalBodyContainer;
    var emptyInputs = true;
    var validationIndex= 0;

    $(`${padre} > .songInput-wrapper`).each(function () {

        var songName = $(this).find('.inputName').val();
        var songUrl = $(this).find('.inputUrl').val();
        
        if (!songName || !songUrl) {
        
                validationIndex++;
                return;
        }
    });

    if(validationIndex === 0){
        emptyInputs = false;
        createInputFields(emptyInputs , modalBodyContainer , elementButtonId)
    }

    if(validationIndex > 0){
        alert('Cant add fields when other still empty');
    }

 }