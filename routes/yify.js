const express = require('express');
const router = express.Router();
const axios = require("axios");
const yifyEp = "https://www.yts.nz/api/v2/list_movies.json?limit=50";
const year = new Date().getFullYear();

var ssn;

router.get('/', async (req, res) => {
    
    ssn = req.session;
    
    // await storeToDB();
    // console.log(process.env.DB_NAME);
    console.log(req.socket.remoteAddress);
    console.log(req.ip);
    console.log(req.headers['x-forwarded-for']);
    
    const recentMovies = Array();
    var page = 1;
    const perPage = 18;
    while(recentMovies.length < perPage) {
        var result = await fetchYify(req, res, page);
        page++;
        if (result == null || result.data == null || result.data.movies == null) continue;
        for(const movie of result.data.movies) {
            if(movie.yt_trailer_code.length > 0 && (movie.year == 2023 || movie.year == 2024)) {
                movie.language = await getLanguage(movie.language);
                recentMovies.push(movie);
                if(recentMovies.length == perPage) {
                    ssn.lastId = movie.id;
                    ssn.lastPage = page-1;
                    // console.log(ssn.lastId + " === " + ssn.lastPage);
                    break;
                }
            }
        }
    }
    res.render('yify', {movies: recentMovies, perPage: perPage});
})

router.get('/loadmore', async (req, res) => {
    
    ssn = req.session;
    
    const recentMovies = Array();
    var page = ssn.lastPage;
    const perPage = 18;
    var isStoreNew = false;
    while(recentMovies.length < perPage) {
        var result = await fetchYify(req, res, page);
        page++;
        if (result == null || result.data == null || result.data.movies == null) continue;
        for(const movie of result.data.movies) {
            if(movie.yt_trailer_code.length > 0 && (movie.year == 2023 || movie.year == 2024)) {
                if (movie.id == ssn.lastId) {
                    isStoreNew = true;
                    continue;
                }
                if (isStoreNew) {
                    movie.language = await getLanguage(movie.language);
                    recentMovies.push(movie);
                    if(recentMovies.length == perPage) {
                        ssn.lastId = movie.id;
                        ssn.lastPage = page-1;
                        // console.log(ssn.lastId + " === " + ssn.lastPage);
                        break;
                    }
                }
            }
        }
    }
    res.render('yify/loadmore.ejs', {movies: recentMovies, perPage: perPage});
})

router.get('/v1', async (req, res) => {
    const recentMovies = Array();
    var page = 1;
    const maxPage = 3;
    const perPage = 18;
    while(page <= maxPage && recentMovies.length < perPage) {
        var result = await fetchYify(req, res, page);
        page++;
        if (result == null || result.data == null || result.data.movies == null) continue;
        for(const movie of result.data.movies) {
            if(movie.yt_trailer_code.length > 0 && (movie.year == 2023 || movie.year == 2024)) {
                movie.language = await getLanguage(movie.language);
                recentMovies.push(movie);
                if(recentMovies.length == perPage) break;
            }
        }
        console.log(recentMovies.length);
    }
    res.render('yify_v1', {movies: recentMovies, perPage: perPage});
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

async function storeToDB() {
    const mysql = require('mysql2');
    const conn = mysql.createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_USER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    const sql = "INSERT INTO movies (yify_id, torrent_json) VALUES ?";
    const values = [['123','{"result":true, "count":42}'],['124','{"result":true, "count":32}']];
    conn.query(sql, [values], function(err){
        if (err) throw err;
        conn.end();
    });
}

module.exports = router;