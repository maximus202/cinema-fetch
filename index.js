$(document).ready(function () {
    function showMenu() {
        $('nav').html('<img src="blacknav.png" alt="Navigation menu icon.">');
    };

    function displaySearchResults() {
        // As a new user,  I want to generate a new film search.
        console.log('displaySearchResults() ran');
    };

    function generateSearchForm() {
        return `
        <h1>Find similar films to...</h1>
        <form>
            <fieldset>
                <legend>Film Details</legend>
                <select name="category" class="search-category" required>
                    <option value="film-title">Film Title</option>
                </select>
                Enter your value:
                <input type="text" name="value" required>
            </fieldset>
        </form>`;
    };

    function displaySearchForm() {
        $('main').html(generateSearchForm);
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