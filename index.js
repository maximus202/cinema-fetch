$(document).ready(function () {
    const tmdbToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTNlNmVlYjIwOGIxZWUxYWFiMDJjMjhiMjZjMDhiMSIsInN1YiI6IjVkZDI5Njg0NTdkMzc4MDAxM2RiNmVjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kXb3Vsx5XBDev3UHF7TnX8EDYPfvuKhNKSGMC2lkxzk';

    function showMenu() {
        $('nav').html('<img src="blacknav.png" alt="Navigation menu icon.">');
    };

    function generateSearchForm() {
        return `
        <h1>Find similar films to...</h1>
        <form>
            <fieldset>
                <legend>Film Search</legend>
                <select name="category" class="search-category" required>
                    <option value="film-title">Film Title</option>
                </select>
                Enter your value:
                <input type="text" name="value" class="user-input" required>
                <input type="submit" name="run-search" class="submit-button">
            </fieldset>
        </form>`;
    };

    function displaySearchForm() {
        $('main').html(generateSearchForm());
    };

    function generateConfirmFilmTitlePage(responseJson) {
        return `<h2>Select a Film Title</h2>
        <div>${responseJson.results[0].original_title}
        </div>`
    };

    function confirmFilmTitle(responseJson) {
        $('main').append(generateConfirmFilmTitlePage(responseJson));
    };

    function fetchFilmData(category, value) {
        console.log(`fetchFilmData() ran with ${category} and ${value}`);
        const options = {
            headers: new Headers({
                'Authorization': `Bearer ${tmdbToken}`
            })
        };
        fetch(`https://api.themoviedb.org/3/search/movie?query=${value}`, options)
            .then(response => response.json())
            .then(responseJson => confirmFilmTitle(responseJson));
    };

    function runSearch() {
        console.log('runSearch() ran');
        $('main').on('click', '.submit-button', event => {
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


    displaySearchResults();
    runSearch();
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