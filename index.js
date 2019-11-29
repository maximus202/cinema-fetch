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
            <fieldset class="genres">
                <legend>Genres</legend>
                <div class="genres-results">
                </div>
            </fieldset>
            <fieldset class="languages">
                <legend>Languages</legend>
                <div class="languages-results">
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

function showGenresAvailable(responseJson) {
    $('.genres-results').append('<form>');
    for (let i = 0; i < responseJson.genres.length; i++) {
        $('.genres-results').append(
            `${responseJson.genres[i].name}
            <input type="radio" class="na" name="${responseJson.genres[i].name}" value="N/A" checked>N/A
            <input type="radio" class="include" name="${responseJson.genres[i].name}" value="${responseJson.genres[i].id}">Include
            <input type="radio" class="exclude" name="${responseJson.genres[i].name}" value="${responseJson.genres[i].id}">Exclude`)
    };
    $('.genres-results').append(`</form>`);
};

function showLanguagesAvailable(responseJson) {
    $('.languages-results').append(`<form>`);
    for (let i = 0; i < responseJson.length; i++) {
        $('.languages-results').append(`<input type="checkbox" name="languages" value="${responseJson[i].iso_639_1}">${responseJson[i].english_name}`)
    };
    $('.languages-results').append(`</form>`);
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

function setGenres() {
    $('main .form').on('change', `.include`, event => {
        const includedGenres = $(`input.include:checked`);
        const includedGenreIds = [];
        for (let i = 0; i < includedGenres.length; i++) {
            includedGenreIds.push(includedGenres[i].value)
        };
        SEARCH.withGenres = includedGenreIds;
        console.log(SEARCH.withGenres);
    });
    $('main .form').on('change', `.exclude`, event => {
        const excludedGenres = $(`input.exclude:checked`);
        const excludedGenreIds = [];
        for (let i = 0; i < excludedGenres.length; i++) {
            excludedGenreIds.push(excludedGenres[i].value)
        };
        SEARCH.withoutGenres = excludedGenreIds;
        console.log(SEARCH.withoutGenres);
    });
};

function setLanguages() {
    $('main .form').on('change', 'input[name=languages]', event => {
        const checkedBoxes = $('input[name=languages]:checked');
        const languageIds = [];
        for (let i = 0; i < checkedBoxes.length; i++) {
            languageIds.push(checkedBoxes[i].value)
        };
        SEARCH.withOriginalLanguage = languageIds;
        console.log(SEARCH.withOriginalLanguage);
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

function generateMasterSearchUrlString() {
    const withKeywords = SEARCH.withKeywords.join("|");
    const withoutKeywords = SEARCH.withoutKeywords.join("|");
    const withGenres = SEARCH.withGenres.join("|");
    const withoutGenres = SEARCH.withoutGenres.join("|");
    const withOriginalLanguage = SEARCH.withOriginalLanguage.join("|");
    const primaryReleaseDateStart = `${SEARCH.primaryReleaseDateStart}`;
    const primaryReleaseDateEnd = `${SEARCH.primaryReleaseDateEnd}`;
    const withPeople = SEARCH.withPeople.join("|");
    const masterSearchUrlString = `?with_keywords=${withKeywords}&without_keywords${withoutKeywords}=&with_genres=${withGenres}&without_genres=${withoutGenres}&with_original_language=${withOriginalLanguage}&primary_release_date.gte=${primaryReleaseDateStart}&primary_release_date.lte=${primaryReleaseDateEnd}&with_people=${withPeople}&with_runtime.gte=${SEARCH.withRuntimeStart}&with_runtime.lte=${SEARCH.withRuntimeEnd}`;
    fetchMasterSearch(masterSearchUrlString);
};

function fetchMasterSearch(masterSearchUrlString) {
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/discover/movie${masterSearchUrlString}`, options)
        .then(response => response.json())
        .then(responseJson => displaySearchResults(responseJson));
};

function runMasterSearch() {
    $('main .form').on('click', '.master-search-submit-button', event => {
        event.preventDefault();
        generateMasterSearchUrlString();
    });
};

function displaySearchResults(responseJson) {
    console.log(responseJson);
    $('main .results').empty();
    for (let i = 0; i < responseJson.results.length; i++) {
        $('main .results').append(`
            <div class="container">
            <img src="https://image.tmdb.org/t/p/w500${responseJson.results[i].poster_path}" alt="${responseJson.results[i].original_title}">
            <div class="bottom-left">
            <h3>${responseJson.results[i].original_title}</h3>
            <img src="more.png" alt="Button that allows you to see more details about this title." class="more-button">
            </div>
            </div>`);
    };
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
    runPeopleSearch();
    setWithKeywords();
    setGenres();
    setLanguages();
    setReleaseYear();
    setPeople();
    setRuntime();
    setWithoutKeywords();
    runMasterSearch();
    displayFilmDetails();
});