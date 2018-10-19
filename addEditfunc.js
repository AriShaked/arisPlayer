function addEditPlaylist(inputName, inputUrl, elementId) {

    if (elementId == '#editPlaylistBoxNextButton'){
        $(elementId).prop("disabled", false);
    }
    $(inputName).val("");
    $(inputUrl).val("");
    $(".modal-image").html("");

    $(inputUrl).on('keyup', function () {
       var playlistUrlValue = $(inputUrl).val();
        $(".modal-image").html(`<img id='tempImage' src="${playlistUrlValue}" />`);
    });
//////////// on input//////////////
    $('input').on("keyup", function () {
        var playlistNameValue = $(inputName).val();
        var playlistUrlValue = $(inputUrl).val();

        if (!playlistNameValue || !playlistUrlValue) {
            $(elementId).prop("disabled", true);
            if (!$(this).val()) {

                $(this).addClass("notValidPink");

            } else {
                $(this).removeClass("notValidPink");
            }
        } else {
            $(inputName).removeClass("notValidPink");
            $(inputUrl).removeClass("notValidPink");
            $(elementId).prop("disabled", false);

        }
    });
}