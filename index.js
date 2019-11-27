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

//withKeyword Search start
function generateWithKeywordSearch() {
    return `
        <h1>Build your smart search</h1>
        <form>
            <fieldset>
                <legend>Keyword to include</legend>
                <input type="text" name="value" class="with-keyword-input" placeholder="Enter a keyword (ex: boxing)" required>
                <input type="submit" name="run-search" class="with-keyword-submit-button">
            </fieldset>
        </form>`;
};

function displayWithKeywordSearch() {
    $('main .form').html(generateWithKeywordSearch());
};

function fetchKeywordData(value) {
    console.log(`fetchFilmData() ran with ${value}`);
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/keyword?query=${value}`, options)
        .then(response => response.json())
        .then(responseJson => showWithKeywordSearchResults(responseJson));
};

function runWithKeywordSearch() {
    console.log('runSearch() ran');
    $('main .form').on('click', '.with-keyword-submit-button', event => {
        console.log('runSearch() ran');
        event.preventDefault();
        console.log('listener working.');
        const value = $('.with-keyword-input').val();
        console.log(value);
        fetchKeywordData(value);
    });
};

function showWithKeywordSearchResults(responseJson) {
    //$('main .results').empty();
    $('main .results').append(`<h2>Select which keywords to include</h2>
        <form>`);
    for (let i = 0; i < responseJson.results.length; i++) {
        $('main .results').append(`
                <input type="checkbox" name="keyword" value="${responseJson.results[i].id}">${responseJson.results[i].name}
                `)
    };
    $('main .results').append(`</form><p>Want to add a another keyword to include? Simply type it in the keyword search bar above and resubmit.</p>`);
};

function setWithKeywords() {
    $('main').on('change', 'input[name=keyword]', event => {
        const checkedBoxes = $('input[name=keyword]:checked');
        const withKeywordIds = [];
        for (let i = 0; i < checkedBoxes.length; i++) {
            withKeywordIds.push(checkedBoxes[i].value);
        };
        SEARCH.keywords = withKeywordIds;
        console.log(SEARCH.keywords);
    });
};
//withKeywords search end

function displaySearchResults() {
    // As a new user,  I want to generate a new film search.
    console.log('displaySearchResults() ran');
};

function displayFilmDetails() {
    //As a new user, I want to see all details for a specific film.
    console.log('displayFilmDetails() ran');
};

$(function () {
    displaySearchResults();
    runWithKeywordSearch();
    setWithKeywords();
    displayWithKeywordSearch();
    displayFilmDetails();
    showMenu();
});