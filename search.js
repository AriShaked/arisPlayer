
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