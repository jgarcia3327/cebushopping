const express = require('express');
const router = express.Router();
const axios = require("axios");
const yifyEp = "https://www.yts.nz/api/v2/list_movies.json?limit=50";
const year = new Date().getFullYear();

router.get('/', async (req, res) => {
    console.log(req.socket.remoteAddress);
    console.log(req.ip);
    console.log(req.headers['x-forwarded-for']);
    
    const recentMovies = Array();
    var page = 1;
    const maxPage = 2;
    while(page <= maxPage) {
        var result = await fetchYify(req, res, page);
        page++;
        if (result == null || result.data == null || result.data.movies == null) continue;
        for(const movie of result.data.movies) {
            if(movie.year == year) {
                movie.language = await getLanguage(movie.language);
                recentMovies.push(movie);
            }
        }
        console.log(recentMovies.length);
    }
    // console.log(recentMovies);
    res.render('yify', {movies: recentMovies, firstName: "Julius"});
})

async function fetchYify(req, res, page) {
    return await axios.get(yifyEp + "&page="+page).then(
        response => {
            return response.data;
        }
    ).catch( err => {
        console.log(err);
        res.render('yify/err', {error: err});
    });
};



async function getLanguage(code){
    const lang = new Intl.DisplayNames(['en'], {type: 'language'});
    return lang.of(code);
}

module.exports = router;