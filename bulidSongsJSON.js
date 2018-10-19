
    function buildSongsJSON(){
        songsArray = [];
    $('.songInput-wrapper').each(function () {
        var songName = $(this).find('.inputName').val();
        var songUrl = $(this).find('.inputUrl').val();
        if (!songName || !songUrl) {

            console.log("Name and Url are required to add the song to the list")
            return;
        }
        songsArray.push({
            "name": songName,
            "url": songUrl
        }, )

    });
    
    return songsArray;
    }