$(document).ready(function () {

    hidePlayer();

    getAllAlbums();
    ///////////////////////////////////searchBox ( on keyup --->  search for match    )   ///////////////////////////////
    $('#searchBox').keyup(function () {

        searchAlbum();

        function searchAlbum() {
            var search = $('#searchBox').val();
            if (search.length > 1) {
                $("#container").html("");
                var filter = search.toUpperCase();
                var allAlbums = $("body").data("AlbumsData");
                var albumsData = allAlbums.data;
                searchResult = [];
                for (let index = 0; index < albumsData.length; index++) {
                    var upperCaseLoopSongs = albumsData[index].name.toUpperCase();

                    if (upperCaseLoopSongs.indexOf(filter) > -1) {
                        searchResult.push(albumsData[index]);
                        $("#container").html("");
                        drawAlbums(searchResult);
                    }
                }
            } else {
                console.log("2 letters minimum");
                $("#container").html("");
                getAllAlbums();
            }
        }
    });
    ///////////////ask the server for all playlists(albums) ////////////////////////////////////////////////
    function getAllAlbums() {
        $.ajax({
            method: 'GET',
            url: `http://localhost/playlist/api/playlist`,
            success: function (data) {
                var allAlbumsData = data;
                $("body").data("AlbumsData", allAlbumsData);
                drawAlbums(data.data);
            }
        });
    };
    //////////////////// create new playlist(album) open modal 1 and input fields for name and url + show the image   ////////////////
    $("#addNewPlaylist").on('click', function () {
        addEditPlaylist('#newPlaylistName', '#newPlaylistUrl', '#addNewPlaylistBoxNextButton');
    });
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function getAlbumSongsFromAPI() {
        var parentId = $("#player").data("playerCurrentAlbumId");
        $.ajax({
            method: 'GET',
            url: `http://localhost/playlist/api/playlist/${parentId}/songs`,
            success: function (data) {
                console.log(data);
                $("#playerListDiv").html("");
                $("#playerImageDiv").html("");
                $("#playerControlsDiv").html("");
                $("#player").data("songs", "");
                $("#player").data("songs", data.data.songs);
                drawPlaylist();
            }
        });
    }
    ///////////////////// DELETE   ------  on click gets album id and send ajax delete request to the server/////
    $("#deleteAlbumYesButton").on('click', function () {
        var deleteIt = $("#player").data("deleteAlbumId");
        deleteAlbum(deleteIt);
    });

    $('#addNewPlaylistBoxNextButton').on('click', function () {

        $(".inputUrl").val("");
        $(".inputName").val("");
        isItMp3('#addNewPlaylistBoxFinishButton');
        var newPlaylistNameValue = $('#newPlaylistName').val();
        var newPlaylistUrlValue = $('#newPlaylistUrl').val();

        /////////////////////////////////////// add more songs inputfields - button   /////////////////////////// ///
        $('#addNewPlaylistBoxAddSongfieldButton').on('click', function () {
            // var createInputFields = true;
            strict_cantAddFieldsIfOthersEmpty(createInputFields, ".modal2-body", "#addNewPlaylistBoxFinishButton");
        });
        ////////////////////////on click get songs value , put in array and make ajax request for creating new playlist/////////////////////////////////

        $('#addNewPlaylistBoxFinishButton').on('click', function () {
            $('#container').html("");
            songsArray = [];
            buildSongsJSON();
            var newPlaylist = {
                "name": newPlaylistNameValue,
                "image": newPlaylistUrlValue,
                "songs": songsArray
            }
            console.log(newPlaylist);
            var data = newPlaylist;
            console.log(data);
            $.post(`http://localhost/playlist/api/playlist`, data);
            $('.modal2-body').html(`
            <div class="songInput-wrapper">
            Song URL
            <input type="text" id='song1Url' class='inputUrl' />
            Name
            <input type="text" id='song1Name' class='inputName' /><br /><br />`);
            $('.modal').modal('hide');
            $('#container').html("");
            getAllAlbums();
        });
    });

    /////////////draw playlists //////////////////////////////////////////////////////////////////////////////////////

    function drawAlbums(searchResults) {
        for (let index = 0; index < searchResults.length; index++) {

            var showResults = $(`<div class="album" id="${searchResults[index].id}"></div>"`).html(`
                <svg height="120" width="320" >
                    <path id="curve" fill="transparent" d="M 30 120 q 150 -145 320 70" />
                    <text width="320" text-anchor="middle" x="150" y="-145">
                        <textPath xlink:href="#curve"  >
                        ${searchResults[index].name}` +
                `</textPath>
                    </text>
                </svg>  ` +
                `<img src="${searchResults[index].image}">` +

                ` <button type="button" id="xIcon" data-toggle="modal" data-target="#modal3">
                    <span class="glyphicon glyphicon-remove"></span>  
                  </button>` +
                `<button type="button" id='pencilIcon' data-toggle="modal" data-target="#modal4">
                        <span class="glyphicon glyphicon-pencil"></span> 
                    </button>` +
                `<button type="submit" id='playIcon'>
                    <span class="glyphicon glyphicon-play"></span>
                  </button>`
            );
            showResults.attr('id', `${searchResults[index].id}`);
            showResults.attr('data-img', `${searchResults[index].image}`);

            $("#container").append(showResults);
        }
        //////////////////////////-------------------on clicking play in one of albums ,  plays the album------------------------////
        $(".album #playIcon").on('click', function () {

            var editAlbumId = this.parentNode.id;
            var editAlbumName = this.parentNode.innerText;
            var editAlbumImgUrl = this.parentNode.dataset.img;

            $('.album > img').removeClass("spin");
            $(`#${editAlbumId} > img`).addClass("spin");
            $("#player").data("playerCurrentAlbumId", editAlbumId);
            $("#player").data("playerCurrentAlbumName", editAlbumName);
            $("#player").data("playerCurrentAlbumImgUrl", editAlbumImgUrl);
            $("#container").addClass('containerDive');
            $("title").html(editAlbumName);
            getAlbumSongsFromAPI();
        });
        //////////////////////////////////////when click on xicon - modal3( delete) open////////////////////
        $(".album #xIcon , .playerAreaXIconButton").on('click', function () {
            if (this.parentNode.id) {

                deleteAlbumId = this.parentNode.id;
                console.log("small");
            } else {
                console.log("big");
                deleteAlbumId = $("#player").data("playerCurrentAlbumId");
            }
            $("#player").data("deleteAlbumId", deleteAlbumId);
        });
        /////////////////////edit -- on click opens modal4 and append current album name and image inside modal- input fields/////////
        $(".album #pencilIcon , .playerAreaPencilIconButton").on('click', function editAlbum() {

            if (this.parentNode.id) {
                editAlbumId = this.parentNode.id;
                console.log("small");
            } else {
                editAlbumId = $("#player").data("playerCurrentAlbumId");
                console.log("big");
            }
            console.log(editAlbumId);
            $("#editPlaylistName").val("");
            $("#editPlaylistUrl").val("");

            $("#player").data("playerCurrentAlbumId", editAlbumId);
            $.ajax({
                method: 'GET',
                url: `http://localhost/playlist/api/playlist/${editAlbumId}`,
                success: function (data) {
                    console.log(data);
                    $("#editPlaylistName").val(data.data.name);
                    $("#editPlaylistUrl").val(data.data.image);
                    console.log(data.data.name);
                    console.log(data.data.image);
                    var editAlbumName = data.data.name;
                    var editAlbumImgUrl = data.data.image;
                    $("#player").data("playerCurrentAlbumName", editAlbumName);
                    $("#player").data("playerCurrentAlbumImgUrl", editAlbumImgUrl);
                    $(".modal-image").html(`<img id='tempImage' src="${data.data.image}" />`);
                }
            });
            addEditPlaylist('#editPlaylistName', '#editPlaylistUrl', '#editPlaylistBoxNextButton');
        });
    }
    ////////////////////////////////////
    $("#addNewPlaylistBoxResetButton , #editNewPlaylistBoxResetButton").on('click', function () {
        $('input').val("");
        $(".modal-image").html("");
    });

    $("#editPlaylistBoxNextButton").on('click', function () {

        var editPlaylistNameValue = $('#editPlaylistName').val();
        var editPlaylistUrlValue = $('#editPlaylistUrl').val();
        var editAlbumId = $("#player").data("playerCurrentAlbumId");
        $("#player").data("playerCurrentAlbumName", editPlaylistNameValue);
        $("#player").data("playerCurrentAlbumImgUrl", editPlaylistUrlValue);
        var editPlaylist = {
            "name": editPlaylistNameValue,
            "image": editPlaylistUrlValue,
        }
        var data = editPlaylist;
        $.post(`http://localhost/playlist/api/playlist/${editAlbumId}`, data);

        $.ajax({
            method: 'GET',
            url: `http://localhost/playlist/api/playlist/${editAlbumId}/songs`,
            success: function (data) {
                var editAlbumsongList = data.data.songs;

                $(".modal5-body").html("");
                for (let index = 0; index < editAlbumsongList.length; index++) {

                    $(".modal5-body").append(`<div class="songInput-wrapper">  
                       Song URL
                        <input type="text" id='song` + `${index+1}` + `Url' class='inputUrl' value="${editAlbumsongList[index].url}"/>
                         Name
                        <input type="text" id='song` + `${index+1}` + `name' class='inputName' value="${editAlbumsongList[index].name}"/><br /><br />
                        </div>
                    `);
                    if (index == editAlbumsongList.length - 1) {
                        isItMp3("#editPlaylistBoxUpdateButton");
                    }
                }
            }
        });

    });
    /////////////////////////////////////////////////////////////////////////////// adds another song fields on edit (modal 5) mode
    $('#editPlaylist-Add-SongInputField-Button').on('click', function () {
        
        strict_cantAddFieldsIfOthersEmpty(createInputFields, ".modal5-body", "#editPlaylistBoxUpdateButton");
    });
    /////////////////songs editing - on click next button(on modal5) gets album id
    ///////////////////////, loop on songs input fields and put into array save as data and post to server with ajax req //////////
    $("#editPlaylistBoxUpdateButton").on('click', function () {
        buildSongsJSON();
        var editPlaylistSongs = {
            "songs": songsArray
        }
        var data = editPlaylistSongs;
        console.log(data);
        $.post(`http://localhost/playlist/api/playlist/${editAlbumId}/songs`, data);

        $('.modal').modal('hide');
        $('#container').html("");
        getAllAlbums();
        $("#container").addClass('containerDive');
        $('#playerListDiv').html("");
        getAlbumSongsFromAPI();
    });
    ///////after clicking specific album -gets json of songs and albumCoverImage,  loops on json and append a songslist in the playerdiv ////
    function drawPlaylist() {
        var songsList = $("#player").data("songs");
        var albumCoverImage = $("#player").data("playerCurrentAlbumImgUrl");

        for (let index = 0; index < songsList.length; index++) {

            var showResults = $(`<div class="song"  data-name="song${index+1}" data-songlistindex='${index+1}' id='${songsList[index].url}'></div>"`).html(

                `<span class="playerSongNum"> ${index+1}` + `.</span>` + ` ${songsList[index].name} `
            );
            $("#playerListDiv").append(showResults);
        }
        $("#playerImageDiv").append(`<img id='playerImage' class="spinPlayerImageDiv" src="${albumCoverImage}" />` +
            `<button type="submit" id='playerImageCenterButton'>
        <span class="glyphicon glyphicon-pause"></span></button>`);
        showPlayer();
        playSong(songsList, 0);

        $('#playerImageCenterButton').on('click', function () {
            myAudio.paused ? myAudio.play() : myAudio.pause();
        });
        ////////////////////////////////////////adds small play icon when hover on song ////////////////////////////////
        $(".song").on('mouseenter', function () {

            if (this.classList.contains('strong')) {

                $(".strong span").html("");
                $(".strong span").removeClass("playerSongNum");
                $(".strong span").removeClass("glyphicon glyphicon-play");
                $(".strong span").addClass("glyphicon glyphicon-pause");
                return;
            } else {
                $(this).addClass("strongSong");
                $(this).removeClass("playerSongNum");
                $(this).find('span').addClass("glyphicon glyphicon-play");
                $(this).find('span').html("");
            }

            $(".song").on('mouseleave', function () {

                if (this.classList.contains('strong')) {
                    console.log("hhhhhh");
                    $(".strong span").removeClass("glyphicon glyphicon-pause");
                    $(".strong span").addClass("glyphicon glyphicon-play");
                    //  $(".strong span").Class("glyphicon glyphicon-pause");
                    return;
                } else {
                    var numOfSong = this.dataset.songlistindex;
                    $(this).find('span').removeClass("glyphicon glyphicon-play songslistplayIcon");
                    $(this).removeClass("strongSong");
                    $(this).removeClass("strong");
                    $(this).addClass("playerSongNum");
                    $(this).find('span').html("");
                    $(this).find('span').html(`${numOfSong}` + `.`);
                }
            });
        });
    }
    /////////when click on song in player ,  adds it class "strong", and  play it ////////////////////////////////////////////////////////////////////
    $("#playerListDiv").on('click', ".song ", function () {

        if (this.classList.contains('strong')) {
            myAudio.paused ? myAudio.play() : myAudio.pause();
            return;
        }
        var nowPlaying = event.target.innerText;
        var songsList = $("#player").data("songs")
        var songIndex = (nowPlaying[0] - 1);
        if (songIndex < 0 || !songIndex) {
            var songIndex = this.dataset.songlistindex;
            songIndex = songIndex - 1;
        }
        playSong(songsList, songIndex);
    });
    ///////////////  gets songs list to play . gets i .adds class"strong"(bold-style),  append url inside <audio> tags , inside playerDiv . play song   ///////////////////////////
    function playSong(songsListToPlay, i) {

        if (i == songsListToPlay.length) {
            alert("album finished");
        } else {

            $(`.song ,.song span`).removeClass("strongSong");
            $(`.song ,.song span`).removeClass("strong");
            $(`.song ,.song span`).addClass("playerSongNum");
            $(`.song ,.song span`).removeClass("glyphicon glyphicon-play");
            $(`.song ,.song span`).removeClass("glyphicon glyphicon-pause");

            $(`.song span`).each(function () {

                var num = this.parentNode.dataset.songlistindex;
                $(this).html(`${num}` + `.`);

            });

            $(`[data-name='song` + `${i+1}']`).addClass("strong");
            $(`[data-name='song` + `${i+1}'] > span`).html("");
            $(`[data-name='song` + `${i+1}'] > span`).removeClass("playerSongNum");
            $(`[data-name='song` + `${i+1}'] > span`).addClass("glyphicon glyphicon-play");

            var nowPlaying = `${songsListToPlay[i].url}`;
            $("#playerControlsDiv").html(
                `<audio id="myAudio" controls autoplay>` +
                `<source src="${nowPlaying}"` + `type="audio/mpeg">` +
                `</audio>` + `<h4>Now Playing:` + `${songsListToPlay[i].name}` + `</h4>`);
            songPause();
            songPlay();
            songEnded(songsListToPlay, i);
        }
    }
    /////////// when eventListener gets the fired  "ended" from the player, going i++ to next song in array and calls to playNextSong function ///

    function songEnded(songsListToPlay, i) {
        $("#myAudio").on('ended', playSong, function () {
            i++;
            playSong(songsListToPlay, i);
        });
    }
    ////////////////////////////////pause//////////////////////
    function songPause() {
        $("#myAudio").on('pause', function () {
            $("#playerImage").removeClass("spinPlayerImageDiv");
            $(".album > img").removeClass("spin");
            $('#playerImageCenterButton').html('<span class="glyphicon glyphicon-play"></span>');
        });
    }
    ////////////////////////////////play//////////////////////
    function songPlay() {
        $("#myAudio").on('play', function () {
            $("#playerImage").addClass("spinPlayerImageDiv");
            $('#playerImageCenterButton').html('<span class="glyphicon glyphicon-pause"></span>');
            var parentId = $("#player").data("playerCurrentAlbumId");
            $(`#${parentId} > img`).addClass("spin");

        });
    }
    //////////////// DELETE   ------  on click gets album id and send ajax delete request to the server/////
    function deleteAlbum(deleteAlbumId) {
        $.ajax({
            method: 'DELETE',
            url: `http://localhost/playlist/api/playlist/${deleteAlbumId}`,
            success: function (data) {
                //console.log(data);
                $("#container").html("");
                getAllAlbums();
                hidePlayer();
                $("#container").removeClass('containerDive');
                $("title").html("player");
            }
        });
    }
});