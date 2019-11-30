const SEARCH = {
    withKeywords: [],
    withoutKeywords: [],
    primaryReleaseDateStart: '',
    primaryReleaseDateEnd: '',
    withPeople: [],
    withRuntimeStart: '',
    withRuntimeEnd: '',
    sortBy: '',
};

const tmdbToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTNlNmVlYjIwOGIxZWUxYWFiMDJjMjhiMjZjMDhiMSIsInN1YiI6IjVkZDI5Njg0NTdkMzc4MDAxM2RiNmVjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kXb3Vsx5XBDev3UHF7TnX8EDYPfvuKhNKSGMC2lkxzk';
const apiKey = '813e6eeb208b1ee1aab02c28b26c08b1';
const imdbApiKey = '0823bc3d86mshee07fc4e8741c97p13dedcjsn9e48b49e1470';

function generateSearchForm() {
    return `
        <h1>Build your smart search</h1>
        <form>
            <fieldset class="with-keyword">
                <legend>Keywords to include</legend>
                <input type="text" name="value" class="with-keyword-input" placeholder="Ex: boxing">
                <input type="submit" name="run-search" class="with-keyword-submit-button">
                <div class="with-keyword-results">
                </div>
            </fieldset>
            <fieldset class="without-keyword">
                <legend>Keywords to exclude</legend>
                <input type="text" name="value" class="without-keyword-input" placeholder="Ex: boxing day">
                <input type="submit" name="run-search" class="without-keyword-submit-button">
                <div class="without-keyword-results">
                </div>
            </fieldset>
            <fieldset>
                <legend>Release Year</legend>
                From year:
                <input type="text" name="start-release-year" class="start-release-year" placeholder="Ex: 1900">
                To year:
                <input type="text" name="end-release-year" class="end-release-year" placeholder="Ex: 2019">
            </fieldset>
            <fieldset class="with-people">
                <legend>Cast/Crew</legend>
                <input type="text" name="with-people-input" class="with-people-input" placeholder="Ex: David Fincher">
                <input type="submit" name="run-with-people-search" class="with-people-submit-button">
                <div class="people-results">
                </div>
            </fieldset>
            <fieldset class="runtime">
                <legend>Runtime</legend>
                Film duration (in minutes)
                <input type="text" name="start-runtime" class="start-runtime" placeholder="Ex: 60">
                -
                <input type="text" name="end-runtime" class="end-runtime" placeholder="Ex: 120">
            </fieldset>
            <fieldset class="sort-by">
                <legend>Sort by</legend>
                <select name="sort-by">
                    <option value="popularity.desc" default>Most Popular</option>
                    <option value="popularity.asc">Least Popular</option>
                    <option value="release_date.desc">Release Date (Newest)</option>
                    <option value="release_date.asc">Release Date (Oldest)</option>
                    <option value="vote_average.desc">Highest Votes</option>
                    <option value="vote_average.asc">Lowest Votes</option>
                </select>
            </fieldset>
            <input type="submit" name="run-master-search" class="master-search-submit-button">
        </form>`;
};

function displaySearchForm() {
    $('main .form').html(generateSearchForm());
};

function fetchWithKeywordData(value) {
    console.log(`fetchKeywordData() ran with and ${value}`);
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/keyword?query=${value}`, options)
        .then(response => response.json())
        .then(responseJson => showWithKeywordResults(responseJson));
};

function fetchWithoutKeywordData(value) {
    console.log(`fetchKeywordoutData() ran with and ${value}`);
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/keyword?query=${value}`, options)
        .then(response => response.json())
        .then(responseJson => showWithoutKeywordResults(responseJson));
};

function fetchWithPeople(value) {
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/person?query=${value}`, options)
        .then(response => response.json())
        .then(responseJson => showPeopleAvailable(responseJson));
};

function fetchMasterSearch(masterSearchUrlString) {
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/discover/movie${masterSearchUrlString}`, options)
        .then(response => response.json())
        .then(responseJson => fetchMovieDetails(responseJson));
};

function fetchMovieDetails(responseJson) {
    $('main .form').html('<h2>Here are your results!</h2>');
    $('main .actions').html('<button type="button" name="start-new-search">Start New Search</button> <button type="button" name="load-more-results">Load More Results</button>');
    for (let i = 0; i < responseJson.results.length; i++) {
        const options = {
            headers: new Headers({
                'Authorization': `Bearer ${tmdbToken}`
            })
        };
        fetch(`https://api.themoviedb.org/3/movie/${responseJson.results[i].id}`, options)
            .then(response => response.json())
            .then(responseJson => fetchFilmDetailsFromImdb(responseJson.imdb_id));
    };
};

function fetchFilmDetailsFromImdb(imdbId) {
    const imdbOptions = {
        headers: new Headers({
            'X-RapidAPI-Key': `0823bc3d86mshee07fc4e8741c97p13dedcjsn9e48b49e1470`
        })
    };
    fetch(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${imdbId}`, imdbOptions)
        .then(response => response.json())
        .then(responseJson => displaySearchResults(responseJson));
};

function runKeywordSearch() {
    $('main .form').on('click', '.with-keyword-submit-button', event => {
        event.preventDefault();
        const value = $('.with-keyword-input').val();
        fetchWithKeywordData(value);
    });
    $('main .form').on('click', '.without-keyword-submit-button', event => {
        event.preventDefault();
        const value = $('.without-keyword-input').val();
        fetchWithoutKeywordData(value);
    });
};

function runPeopleSearch() {
    $('main .form').on('click', '.with-people-submit-button', event => {
        event.preventDefault();
        const value = $('.with-people-input').val();
        fetchWithPeople(value);
    });
};

function showWithKeywordResults(responseJson) {
    $('.with-keyword-results').append(`<h2>Select your keywords to include:</h2>
        <form>`);
    for (let i = 0; i < responseJson.results.length; i++) {
        $('.with-keyword-results').append(`
                <input type="checkbox" name="with-keyword" value="${responseJson.results[i].id}">${responseJson.results[i].name}
                `)
    };
    $('.with-keyword-results').append(`</form>`);
};

function showWithoutKeywordResults(responseJson) {
    $('.without-keyword-results').append(`<h2>Select your keywords to exclude:</h2>
        <form>`);
    for (let i = 0; i < responseJson.results.length; i++) {
        $('.without-keyword-results').append(`
                <input type="checkbox" name="without-keyword" value="${responseJson.results[i].id}">${responseJson.results[i].name}
                `)
    };
    $('.without-keyword-results').append(`</form>`);
};

function showPeopleAvailable(responseJson) {
    $('.people-results').append(`<form>`);
    for (let i = 0; i < responseJson.results.length; i++) {
        $('.people-results').append(`<input type="checkbox" name="with-people" value="${responseJson.results[i].id}">${responseJson.results[i].name}`)
    };
    $('.people-results').append(`</form>`);
};

function setWithKeywords() {
    $('main .form').on('change', 'input[name=with-keyword]', event => {
        const checkedBoxes = $('input[name=with-keyword]:checked');
        const keywordIds = [];
        for (let i = 0; i < checkedBoxes.length; i++) {
            keywordIds.push(checkedBoxes[i].value);
        };
        SEARCH.withKeywords = keywordIds;
        console.log(SEARCH.withKeywords);
    });
};

function setWithoutKeywords() {
    $('main .form').on('change', 'input[name=without-keyword]', event => {
        const checkedBoxes = $('input[name=without-keyword]:checked');
        const keywordIds = [];
        for (let i = 0; i < checkedBoxes.length; i++) {
            keywordIds.push(checkedBoxes[i].value);
        };
        SEARCH.withoutKeywords = keywordIds;
        console.log(SEARCH.withoutKeywords);
    });
};

function setReleaseYear() {
    $('main .form').on('change', 'input[name=start-release-year]', event => {
        const startReleaseYear = $('input[name=start-release-year]:text');
        SEARCH.primaryReleaseDateStart = startReleaseYear;
        console.log(SEARCH.primaryReleaseDateStart);
    });
    $('main .form').on('change', 'input[name=end-release-year]', event => {
        const endReleaseYear = $('input[name=end-release-year]:text');
        SEARCH.primaryReleaseDateEnd = endReleaseYear;
        console.log(SEARCH.primaryReleaseDateEnd);
    });
};

function setPeople() {
    $('main .form').on('change', 'input[name=with-people]', event => {
        const people = $('input[name=with-people]:checked');
        const peopleIds = [];
        for (let i = 0; i < people.length; i++) {
            peopleIds.push(people[i].value);
        };
        SEARCH.withPeople = peopleIds;
        console.log(SEARCH.withPeople);
    });
};

function setRuntime() {
    $('main .form').on('change', 'input[name=start-runtime]', event => {
        const startRuntime = $('input[name=start-runtime]:text');
        SEARCH.withRuntimeStart = startRuntime;
        console.log(SEARCH.withRuntimeStart);
    });
    $('main .form').on('change', 'input[name=end-runtime]', event => {
        const endRuntime = $('input[name=end-runtime]:text');
        SEARCH.withRuntimeEnd = endRuntime;
        console.log(SEARCH.withRuntimeEnd);
    });
};

function setSortBy() {
    $('main .form').on('change', 'select[name=sort-by]', event => {
        const sortBy = $('select[name=sort-by]').val();
        SEARCH.sortBy = sortBy;
        console.log(SEARCH.sortBy);
    })
};

function generateMasterSearchUrlString() {
    const withKeywords = SEARCH.withKeywords.join("|");
    const withoutKeywords = SEARCH.withoutKeywords.join("|");
    const primaryReleaseDateStart = `${SEARCH.primaryReleaseDateStart}`;
    const primaryReleaseDateEnd = `${SEARCH.primaryReleaseDateEnd}`;
    const withPeople = SEARCH.withPeople.join("|");
    const masterSearchUrlString = `?with_keywords=${withKeywords}&without_keywords${withoutKeywords}=&primary_release_date.gte=${primaryReleaseDateStart}&primary_release_date.lte=${primaryReleaseDateEnd}&with_people=${withPeople}&with_runtime.gte=${SEARCH.withRuntimeStart}&with_runtime.lte=${SEARCH.withRuntimeEnd}&sort_by=${SEARCH.sortBy}`;
    fetchMasterSearch(masterSearchUrlString);
};

function runMasterSearch() {
    $('main .form').on('click', '.master-search-submit-button', event => {
        event.preventDefault();
        generateMasterSearchUrlString();
    });
};

function displaySearchResults(responseJson) {
    const imdbId = responseJson.imdbID;
    $('main .form').append(`
            <div class="container">
                <img src="${responseJson.Poster}" alt="${responseJson.Title} poster.">
            <div class="bottom-left">
                <h3>${responseJson.Title}</h3>
                <a href="#${imdbId}" rel="modal:open"><img src="more.png" alt="More button."></a>
            </div>
            <div id="${imdbId}" class="modal">
                <img src="${responseJson.Poster}" alt="Still from ${responseJson.Title} poster." class="screen-still">
                <section class="title_and_score">
                <h3>${responseJson.Title} <span class="reviews">${responseJson.imdbRating}<img src="favorite.png" alt="User rating score."></span></h3>
                </section>
                <p>${responseJson.Plot}</p>
                <p>Released: ${responseJson.Year}</p>
                <p>Genre: ${responseJson.Genre}</p>
                <p>Director: ${responseJson.Director}</p>
                <p>Actors: ${responseJson.Actors}</p>
                <p>Rated: ${responseJson.Rated}</p>
            </div>
            </div>`);
};

function startNewSearch() {
    $('main .actions').on('click', 'button[name=start-new-search]', event => {
        location.reload();
    });
};

function loadMoreResults() {
    $('main .actions').on('click', 'button[name=load-more-results]', event => {
        $('main .form').append(generateMasterSearchUrlString());
    });
};

$(function () {
    displaySearchForm();
    runKeywordSearch();
    runPeopleSearch();
    setWithKeywords();
    setReleaseYear();
    setPeople();
    setRuntime();
    setSortBy();
    setWithoutKeywords();
    runMasterSearch();
    startNewSearch();
    loadMoreResults();
});