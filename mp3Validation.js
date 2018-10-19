
    //////////////////////// mp3 validation //////////////////////////0000000000000000000000000000000000000000000r
    function isItMp3(elementId) {

        $(`.inputUrl`).on("blur", function () {
            
            console.log(elementId)
            console.log(this.id)
            $(elementId).prop("disabled", true);
            var isInputEmpty = $(`#${this.id}`).val();
            if (!isInputEmpty) {
                console.log('empty');
                $(elementId).prop("disabled", false);
            } else {
                console.log('fullllll');
                $(elementId).prop("disabled", true);
                var newPlaylistUrlValue = $(this).val();
                var validMp3 = newPlaylistUrlValue.split('.');

                if ("mp3" == (validMp3[validMp3.length - 1])) {
                    console.log('valid');
                    console.log("validMusicMP3");
                    $(this).removeClass("notValidPink");
                    $(elementId).prop("disabled", false);
                    $('#editPlaylist-Add-SongInputField-Button').prop("disabled", false);
                    $('#addNewPlaylistBoxAddSongfieldButton').prop("disabled", false);
                    
                } else {
                    console.log('not validddd');
                    $(this).addClass("notValidPink");
                    $(elementId).prop("disabled", true);
                    $('#editPlaylist-Add-SongInputField-Button').prop("disabled", true);
                    $('#addNewPlaylistBoxAddSongfieldButton').prop("disabled", true);
                }
            }
        });
    }

