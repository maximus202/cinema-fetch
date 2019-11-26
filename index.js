const SEARCH = {
    keywords: [],
    filmTitle: '',
    directors: [],
    year: [],
    country: '',
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
            <fieldset>
                <legend>Film Search</legend>
                <select name="category" class="search-category" required>
                    <option value="film-title">Keyword</option>
                </select>
                <input type="text" name="value" class="user-input" placeholder="Enter a keyword (ex: boxing)" required>
                <input type="submit" name="run-search" class="submit-button">
            </fieldset>
        </form>`;
};

function displaySearchForm() {
    $('main .form').html(generateSearchForm());
};

function fetchFilmData(category, value) {
    console.log(`fetchFilmData() ran with ${category} and ${value}`);
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/keyword?query=${value}`, options)
        .then(response => response.json())
        .then(responseJson => showSearchResults(responseJson));
};

function runSearch() {
    console.log('runSearch() ran');
    $('main .form').on('click', '.submit-button', event => {
        console.log('runSearch() ran');
        event.preventDefault();
        console.log('listener working.');
        const category = $('.search-category option:selected').val();
        const value = $('.user-input').val();
        console.log(category);
        console.log(value);
        fetchFilmData(category, value);
    });
};

function showSearchResults(responseJson) {
    $('main .results').empty();
    $('main .results').html(`<h2>Select your keywords:</h2>
        <form>`);
    for (let i = 0; i < responseJson.results.length; i++) {
        $('main .results').append(`
                <input type="checkbox" name="keyword" value="${responseJson.results[i].id}">${responseJson.results[i].name}
                `)
    };
    $('main .results').append(`</form>`);
};

function setKeywords() {
    $('main').on('change', 'input[name=keyword]', event => {
        const checkedBoxes = $('input[name=keyword]:checked');
        console.log(checkedBoxes);
        const checked = checkedBoxes.map(item => {
            console.log(item.value);
            return item.value;
        });
        SEARCH.keywords = checked;
        console.log(SEARCH.keywords);
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

function createAccount() {
    //As a new user, I want to create an account.
    console.log('createAccount() ran');
};

function signInToAccount() {
    //As a user with an account, I want to login to my account.
    console.log('signInToAccount() ran');
};

function addToWatchist() {
    //As a user with an account, I want to add a film to my watchlist.
    console.log('addToWatchlist() ran');
};

function removeFromWatchlist() {
    //As a user with an account, I want to remove a film from my watchlist.
    console.log('removeFromWatchlist() ran');
};

function displayWatchlist() {
    //As a user with an account, I want to see my watchlist.
    console.log('displayWatchlist() ran');
};

function editAccount() {
    //As a user with an account, I want to edit my account.
    console.log('editAccount() ran');
};

function deleteAccount() {
    //As a user with an account, I want to delete my account.
    console.log('deleteAccount() ran');
};

function seeAllUsers() {
    //As an admin, I want to see all users.
    console.log('seeAllUsers() ran');
};

function displayWatchlistReport() {
    //As an admin, I want to see a report of films that have been added to watchlists and number of times.
    console.log('displayWatchlistReport() ran');
};

function displayUserSearchHistory() {
    //As an admin	I want to see a history of search queries for each user.
    console.log('displayUserSearchHistory() ran');
};

$(function () {
    displaySearchResults();
    runSearch();
    setKeywords();
    displaySearchForm();
    displayFilmDetails();
    createAccount();
    signInToAccount();
    addToWatchist();
    removeFromWatchlist();
    displayWatchlist();
    editAccount();
    deleteAccount();
    seeAllUsers();
    displayWatchlistReport();
    displayUserSearchHistory();
    showMenu();
});