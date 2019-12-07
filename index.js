/*SEARCH stores the ids returned by TMDb api for withKeywords, withoutKeywords, and withPeople to later be used
in the discover API call. It also stores the input value provided by the user for release dates to filter by and 
how the program should sort the searh results.*/
const SEARCH = {
    withKeywords: [],
    withoutKeywords: [],
    primaryReleaseDateStart: "",
    primaryReleaseDateEnd: "",
    withPeople: [],
    sortBy: "popularity.desc",
    page: 1,
};

//API tokens
const tmdbToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTNlNmVlYjIwOGIxZWUxYWFiMDJjMjhiMjZjMDhiMSIsInN1YiI6IjVkZDI5Njg0NTdkMzc4MDAxM2RiNmVjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kXb3Vsx5XBDev3UHF7TnX8EDYPfvuKhNKSGMC2lkxzk";
const apiKey = "813e6eeb208b1ee1aab02c28b26c08b1";
const imdbApiKey = "0823bc3d86mshee07fc4e8741c97p13dedcjsn9e48b49e1470";

//Contains code that makes the form (Keyword, release date, cast/crew filters).
function generateSearchForm() {
    return `
    <div class="intro">
            <h3>Start a fetch</h3>
        </div>
            <button class="with-keyword-toggle"><img src="target.png" alt="Keywords to include icon.">
            <h3>Keywords to include</h3>
            <p>Feel like watching a murder mystery? Or maybe get transported to Italy? Add keywords to filter your search.</p>
            </button>
                <form class="with-keyword">
                    <fieldset class="with-keyword">
                        <legend>Keywords to include</legend>
                        <input type="text" name="value" class="with-keyword-input" placeholder="Add keyword...">
                        <input type="submit" name="run-search" class="with-keyword-submit-button" value="Find &rarr;">
                        <div class="with-keyword-results">
                        <div class="error-message"></div>
                        </div>
                    </fieldset>
                </form>
            <button class="without-keyword-toggle"><img src="eraser.png" alt="Keywords to exclude icon.">
            <h3>Keywords to exclude</h3>
            <p>Maybe you DON'T want to see movies related to aliens... or you hate spoofs. No judgement. Add keywords to exclude from your search.</p>
            </button>
                <form class="without-keyword">
                    <fieldset class="without-keyword">
                        <legend>Keywords to exclude</legend>
                        <input type="text" name="value" class="without-keyword-input" placeholder="Add keyword...">
                        <input type="submit" name="run-search" class="without-keyword-submit-button" value="Find &rarr;">
                        <div class="without-keyword-results">
                        <div class="error-message"></div>
                        </div>
                    </fieldset>
                </form>
            <button class="release-year-toggle"><img src="calendar.png" alt="Release date icon.">
            <h3>Release Date</h3>
            <p>Feelin' nostalgic? Use this release date filter to target films released in a specific date range.</p>
            </button>
                <form class="release-year">
                    <fieldset>
                        <legend>Release Year</legend>
                        <h3>Start date:</h3>
                        <input type="date" name="start-release-year" class="start-release-year">
                        <h3>End date:</h3>
                        <input type="date" name="end-release-year" class="end-release-year">
                    </fieldset>
                </form>
            <button class="with-people-toggle"><img src="network.png" alt="Cast and crew icon.">
            <h3>Cast and Crew</h3>
            <p>Fan of Tim Burton's eccentric style or Tarantino's colorful dialogue? Add your chosen cast and crew members to filter movies similar to their styles.</p>
            </button>
                <form class="with-people">
                    <fieldset class="with-people">
                        <legend>Cast/Crew</legend>
                        <input type="text" name="with-people-input" class="with-people-input" placeholder="Add name...">
                        <input type="submit" name="run-with-people-search" class="with-people-submit-button" value="Find &rarr;">
                        <div class="people-results">
                        <div class="error-message"></div>
                        </div>
                    </fieldset>
                </form>
            <form>
                <fieldset class="sort-by">
                    <legend>Sort by</legend>
                    <h3>Sort by:</h3>
                    <select name="sort-by">
                        <option value="popularity.desc">Most Popular</option>
                        <option value="popularity.asc">Least Popular</option>
                        <option value="release_date.desc">Release Date (Newest)</option>
                        <option value="release_date.asc">Release Date (Oldest)</option>
                        <option value="vote_average.desc">Highest Votes</option>
                        <option value="vote_average.asc">Lowest Votes</option>
                    </select>
                </fieldset>
            </form>
        <input type="submit" name="run-master-search" class="master-search-submit-button" value="Fetch movies!">`;
}

//Defaults the filters to hide. Clicking them will expand each individual filter allowing
//the user to add an input.
function hideFiltersOnLoad() {
    $("form.with-keyword").toggle();
    $("form.without-keyword").toggle();
    $("form.release-year").toggle();
    $("form.with-people").toggle();
}

function toggleHideAndShowFilters() {
    $("button.with-keyword-toggle").click(function () {
        $("form.with-keyword").toggle();
    })
    $("button.without-keyword-toggle").click(function () {
        $("form.without-keyword").toggle();
    })
    $("button.release-year-toggle").click(function () {
        $("form.release-year").toggle();
    })
    $("button.with-people-toggle").click(function () {
        $("form.with-people").toggle();
    })
}

//Runs generateSearchForm() when document loads to display HTML code in generateSearchForm().
function displaySearchForm() {
    $("main .form").html(generateSearchForm());
}

//Displays API responses for withKeywords which allows users to check which 
//Keywords they want to include in their search.
function showWithKeywordResults(responseJson) {
    $(".with-keyword-results").append(`
        <form>`);
    for (let i = 0; i < responseJson.results.length; i++) {
        $(".with-keyword-results").append(`
                <input id="${responseJson.results[i].id}" type="checkbox" name="with-keyword" value="${responseJson.results[i].id}"><label for="${responseJson.results[i].id}">${responseJson.results[i].name}</label>
                `);
    }
    $(".with-keyword-results").append("</form>");
}

//Runs when an input returns with an error from the API.
function searchFilterNotFound() {
    $(".with-keyword-results .error-message").html("No keywords found. Please try a different keyword.");
    $(".without-keyword-results .error-message").html("No keywords found. Please try a different keyword.");
    $(".people-results .error-message").html("No people found. Please try a different name.");
}

//Fetches keyword data from TMDb.
function fetchWithKeywordData(value) {
    $(".with-keyword-results .error-message").empty();
    const options = {
        headers: new Headers({
            "Authorization": `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/keyword?query=${value}`, options)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.results.length) {
                showWithKeywordResults(responseJson);
            } else {
                searchFilterNotFound();
            }
        })
}

//Displays API responses for withoutKeywords which allows users to check which 
//Keywords they want to exclude in their search.
function showWithoutKeywordResults(responseJson) {
    $(".without-keyword-results").append(`
        <form>`);
    for (let i = 0; i < responseJson.results.length; i++) {
        $(".without-keyword-results").append(`
                <input id="${responseJson.results[i].id}" type="checkbox" name="without-keyword" value="${responseJson.results[i].id}"><label for="${responseJson.results[i].id}">${responseJson.results[i].name}</label>
                `);
    }
    $(".without-keyword-results").append("</form>");
}

//Fetches keyword data from TMDb.
function fetchWithoutKeywordData(value) {
    $(".without-keyword-results .error-message").empty();
    const options = {
        headers: new Headers({
            "Authorization": `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/keyword?query=${value}`, options)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.results.length) {
                showWithoutKeywordResults(responseJson);
            } else {
                searchFilterNotFound();
            }
        })
}

//Displays API responses for withPeopleAvailable which allows users to check which 
//people they want to include in their search.
function showPeopleAvailable(responseJson) {
    $(".people-results").append("<form>");
    for (let i = 0; i < responseJson.results.length; i++) {
        $(".people-results").append(`<input id="${responseJson.results[i].id}" type="checkbox" name="with-people" value="${responseJson.results[i].id}"><label for="${responseJson.results[i].id}">${responseJson.results[i].name}</label>`);
    }
    $(".people-results").append("</form>");
}

//Fetches people available based on user input.
function fetchWithPeople(value) {
    $(".people-results .error-message").empty();
    const options = {
        headers: new Headers({
            "Authorization": `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/person?query=${value}`, options)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.results.length) {
                showPeopleAvailable(responseJson);
            } else {
                searchFilterNotFound();
            }
        })
}

//Displays button that allows user to load more results if they want to see more.
function displayLoadMoreResultsButton() {
    $("main .fetch-more-films-button").html("<button type='button' name='find-more-films'>Find more films</button>");
}


//Displays button that allows user to start a new search.
function displayNewSearchButton() {
    $("main .new-search-button").html("<button type='button' name='start-new-search'>New Search</button>");
}

//Displays search results.
function displaySearchResults(responseJson) {
    const imdbId = responseJson.imdbID;
    const poster = responseJson.Poster.toUpperCase().trim() === "N/A" ? "poster_not_available.png" : responseJson.Poster;
    displayNewSearchButton();
    $("main .results").append(`
            <div class="container">
                <img src="${poster}" alt="${responseJson.Title} poster.">
            <div class="bottom-left">
                <h3>${responseJson.Title}</h3>
                <a href="#${imdbId}" rel="modal:open"><img src="more.png" alt="More button." class="more-button"></a>
            </div>
            <div id="${imdbId}" class="modal">
                <img src="${poster}" alt="Still from ${responseJson.Title} poster." class="screen-still">
                <div class="title-and-score">
                <h2>${responseJson.Title}</h2>
                <div class="review">${responseJson.imdbRating}<img class="review-icon" src="heart.png" alt="User rating score."></div>
                </div>
                <p>${responseJson.Plot}</p>
                <p><span class="film-details-bolding">Released:</span> ${responseJson.Year}</p>
                <p><span class="film-details-bolding">Genre:</span> ${responseJson.Genre}</p>
                <p><span class="film-details-bolding">Director:</span> ${responseJson.Director}</p>
                <p><span class="film-details-bolding">Actors:</span> ${responseJson.Actors}</p>
                <p><span class="film-details-bolding">Rated:</span> ${responseJson.Rated}</p>
            </div>
            </div>`);
}

//Takes the film ids provided by the TMDb discover API call and calls the IMDb API with those ids to grab film data.
function fetchFilmDetailsFromImdb(imdbId) {
    const imdbOptions = {
        headers: new Headers({
            "X-RapidAPI-Key": "0823bc3d86mshee07fc4e8741c97p13dedcjsn9e48b49e1470"
        })
    };
    fetch(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${imdbId}`, imdbOptions)
        .then((response) => response.json())
        .then((responseJson) => displaySearchResults(responseJson));
}

//Fetches film details from TMDb to extract the id which will then be passed to IMDb.
function fetchMovieDetails(responseJson) {
    for (let i = 0; i < responseJson.results.length; i++) {
        displayLoadMoreResultsButton();
        const options = {
            headers: new Headers({
                "Authorization": `Bearer ${tmdbToken}`
            })
        };
        fetch(`https://api.themoviedb.org/3/movie/${responseJson.results[i].id}`, options)
            .then((response) => response.json())
            .then((responseJson) => fetchFilmDetailsFromImdb(responseJson.imdb_id));
    }
}

//Shows message saying there haven't been films found based on their search filters.
function noResultsFound() {
    $("main .fetch-more-films-button").empty();
    $("main .results").html("<p>Sorry, no films available to display. Try a new search.</p>");
    displayNewSearchButton();
}

//Fetches search results based on the user's filters.
function fetchMasterSearch(masterSearchUrlString) {
    const options = {
        headers: new Headers({
            "Authorization": `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/discover/movie${masterSearchUrlString}`, options)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.results.length) {
                fetchMovieDetails(responseJson);
            } else {
                noResultsFound();
            }
        })
}

//Finds available keywords based on user input.
function runKeywordSearch() {
    $("main .form").on("click", ".with-keyword-submit-button", (event) => {
        event.preventDefault();
        const value = $(".with-keyword-input").val();
        fetchWithKeywordData(value);
    })
    $("main .form").on("click", ".without-keyword-submit-button", (event) => {
        event.preventDefault();
        const value = $(".without-keyword-input").val();
        fetchWithoutKeywordData(value);
    })
}

//Finds available people based on user input.
function runPeopleSearch() {
    $("main .form").on("click", ".with-people-submit-button", (event) => {
        event.preventDefault();
        const value = $(".with-people-input").val();
        fetchWithPeople(value);
    })
}

//Sets keyword ids (to include) that have been checked by the user to SEARCH array.
function setWithKeywords() {
    $("main .form").on("change", "input[name=with-keyword]", (event) => {
        const checkedBoxes = $("input[name=with-keyword]:checked");
        const keywordIds = [];
        for (let i = 0; i < checkedBoxes.length; i++) {
            keywordIds.push(checkedBoxes[i].value);
        }
        SEARCH.withKeywords = keywordIds;
    })
}

//Sets keyword ids (to exclude) that have been checked by the user to SEARCH array.
function setWithoutKeywords() {
    $("main .form").on("change", "input[name=without-keyword]", (event) => {
        const checkedBoxes = $("input[name=without-keyword]:checked");
        const keywordIds = [];
        for (let i = 0; i < checkedBoxes.length; i++) {
            keywordIds.push(checkedBoxes[i].value);
        }
        SEARCH.withoutKeywords = keywordIds;
    })
}

//Sets release date ranges to SEARCH array.
function setReleaseYear() {
    $("main .form").on("change", "input[name=start-release-year]", (event) => {
        const startReleaseYear = $("input[name=start-release-year]").val();
        SEARCH.primaryReleaseDateStart = startReleaseYear;
    })
    $("main .form").on("change", "input[name=end-release-year]", (event) => {
        const endReleaseYear = $("input[name=end-release-year]").val();
        SEARCH.primaryReleaseDateEnd = endReleaseYear;
    })
}

//Sets people the user has checked to STORE array.
function setPeople() {
    $("main .form").on("change", "input[name=with-people]", (event) => {
        const people = $("input[name=with-people]:checked");
        const peopleIds = [];
        for (let i = 0; i < people.length; i++) {
            peopleIds.push(people[i].value);
        }
        SEARCH.withPeople = peopleIds;
    });
}

//Sets the dropdown value the user clicked to STORE array.
function setSortBy() {
    $("main .form").on("change", "select[name=sort-by]", (event) => {
        const sortBy = $("select[name=sort-by]").val();
        SEARCH.sortBy = sortBy;
    });
}

//Puts together the string that will be used in the TMDb discover API call. 
function generateMasterSearchUrlString() {
    const withKeywords = SEARCH.withKeywords.join("|");
    const withoutKeywords = SEARCH.withoutKeywords.join("|");
    const withPeople = SEARCH.withPeople.join("|");
    const masterSearchUrlString = `?with_keywords=${withKeywords}&without_keywords=${withoutKeywords}&primary_release_date.gte=${SEARCH.primaryReleaseDateStart}&primary_release_date.lte=${SEARCH.primaryReleaseDateEnd}&with_people=${withPeople}&sort_by=${SEARCH.sortBy}&page=${SEARCH.page}`;
    fetchMasterSearch(masterSearchUrlString);
}

//When the master search button is clicked, this function is triggered.
function runMasterSearch() {
    $("main .form").on("click", ".master-search-submit-button", (event) => {
        event.preventDefault();
        generateMasterSearchUrlString();
    });
}

//When find more films button is clicked, this function is triggered.
function fetchMoreFilms() {
    $("main .fetch-more-films-button").on("click", "button[name=find-more-films]", (event) => {
        SEARCH.page += 1;
        $("main .form").append(generateMasterSearchUrlString());
    });
}

//When start new search button is clicked, this function is triggered.
function startNewSearch() {
    $("main .new-search-button").on("click", "button[name=start-new-search]", (event) => {
        location.reload();
    });
}

//These functions are triggerd on page load.
$(function () {
    displaySearchForm();
    hideFiltersOnLoad();
    toggleHideAndShowFilters();
    runKeywordSearch();
    runPeopleSearch();
    setWithKeywords();
    setReleaseYear();
    setPeople();
    setSortBy();
    setWithoutKeywords();
    runMasterSearch();
    fetchMoreFilms();
    startNewSearch();
});