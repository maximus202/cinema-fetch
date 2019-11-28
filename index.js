const SEARCH = {
    withKeywords: [],
    withoutKeywords: [],
    withGenres: [],
    withoutGenres: [],
    withOriginalLanguage: [],
    primaryReleaseDateStart: '',
    primaryReleaseDateEnd: '',
    withPeople: [],
    withRuntimeStart: '',
    withRuntimeEnd: '',
};

const tmdbToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTNlNmVlYjIwOGIxZWUxYWFiMDJjMjhiMjZjMDhiMSIsInN1YiI6IjVkZDI5Njg0NTdkMzc4MDAxM2RiNmVjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kXb3Vsx5XBDev3UHF7TnX8EDYPfvuKhNKSGMC2lkxzk';
const apiKey = '813e6eeb208b1ee1aab02c28b26c08b1';

function showMenu() {
    $('nav').html('<img src="blacknav.png" alt="Navigation menu icon.">');
};

function generateSearchForm() {
    return `
        <h1>Build your smart search</h1>
        <form>
            <fieldset class="with-keyword">
                <legend>Keywords to include</legend>
                <input type="text" name="value" class="with-keyword-input" placeholder="Ex: boxing" required>
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
            <fieldset class="languages">
                <legend>Languages</legend>
                <div class="languages-results">
                </div>
            </fieldset>
            <fieldset class="genres">
                <legend>Genres</legend>
                <div class="genres-results">
                </div>
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

function fetchLanguagesAvailable() {
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch('https://api.themoviedb.org/3/configuration/languages', options)
        .then(response => response.json())
        .then(responseJson => showLanguagesAvailable(responseJson));
};

function fetchGenresAvailable() {
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch('https://api.themoviedb.org/3/genre/movie/list', options)
        .then(response => response.json())
        .then(responseJson => showGenresAvailable(responseJson));
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

function showLanguagesAvailable(responseJson) {
    $('.languages-results').append(`<form>`);
    for (let i = 0; i < responseJson.length; i++) {
        $('.languages-results').append(`<input type="checkbox" name="languages" value="${responseJson[i].iso_639_1}">${responseJson[i].english_name}`)
    };
    $('.languages-results').append(`</form>`);
};

function showGenresAvailable(responseJson) {
    $('.genres-results').append('<form>');
    for (let i = 0; i < responseJson.genres.length; i++) {
        $('.genres-results').append(
            `${responseJson.genres[i].name}
            <input type="radio" name="${responseJson.genres[i].name}" value="N/A" checked>N/A
            <input type="radio" name="${responseJson.genres[i].name}" value="include">Include
            <input type="radio" name="${responseJson.genres[i].name}" value="exclude">Exclude`)
    };
    $('.genres-results').append(`</form>`);
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

function displaySearchResults() {
    // As a new user,  I want to generate a new film search.
    console.log('displaySearchResults() ran');
};

function displayFilmDetails() {
    //As a new user, I want to see all details for a specific film.
    console.log('displayFilmDetails() ran');
};

$(function () {
    showMenu();
    displaySearchForm();
    fetchLanguagesAvailable();
    fetchGenresAvailable()
    runKeywordSearch();
    setWithKeywords();
    setWithoutKeywords();
    displaySearchResults();
    displayFilmDetails();
});