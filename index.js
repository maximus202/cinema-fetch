const SEARCH = {
    withKeywords: [],
    withoutKeywords: [],
    primaryReleaseDateStart: "",
    primaryReleaseDateEnd: "",
    withPeople: [],
    sortBy: "popularity.desc",
    page: 1,
};

const tmdbToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MTNlNmVlYjIwOGIxZWUxYWFiMDJjMjhiMjZjMDhiMSIsInN1YiI6IjVkZDI5Njg0NTdkMzc4MDAxM2RiNmVjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kXb3Vsx5XBDev3UHF7TnX8EDYPfvuKhNKSGMC2lkxzk";
const apiKey = "813e6eeb208b1ee1aab02c28b26c08b1";
const imdbApiKey = "0823bc3d86mshee07fc4e8741c97p13dedcjsn9e48b49e1470";

function generateSearchForm() {
    return `
        <h1>The search engine for cinephiles! Find similar films to the ones you love with highly-targeted searches. Try it below!</h1>
            <button class="with-keyword-toggle">Hide/Show Keywords to Include</button>
                <form class="with-keyword">
                    <fieldset class="with-keyword">
                        <legend>Keywords to include</legend>
                        <p>Feel like watching a murder mystery? Or maybe get transported to Italy? Simply provide a keyword in the box below and click "Submit" to search for available keywords.</p>
                        <input type="text" name="value" class="with-keyword-input" placeholder="Enter your keyword here.">
                        <input type="submit" name="run-search" class="with-keyword-submit-button" value="Find keywords to include">
                        <div class="with-keyword-results">
                        <div class="error-message"></div>
                        </div>
                    </fieldset>
                </form>
            <button class="without-keyword-toggle">Hide/Show Keywords to Exclude</button>
                <form class="without-keyword">
                    <fieldset class="without-keyword">
                        <legend>Keywords to exclude</legend>
                        <p>Maybe you DON'T want to see movies related to aliens... or you hate spoofs. No judgement here. Use the box below to provide keywords you want to EXCLUDE in your search.</p>
                        <input type="text" name="value" class="without-keyword-input" placeholder="Enter your keyword here.">
                        <input type="submit" name="run-search" class="without-keyword-submit-button" value="Find keywords to exclude">
                        <div class="without-keyword-results">
                        <div class="error-message"></div>
                        </div>
                    </fieldset>
                </form>
            <button class="release-year-toggle">Hide/Show Release Time Frame</button>
                <form class="release-year">
                    <fieldset>
                        <legend>Release Year</legend>
                        <p>Feelin' nostalgic? You can use this date range feature to search for films in a specific time frame.</p>
                        Provide a start date:
                        <input type="date" name="start-release-year" class="start-release-year">
                        Provide an end date:
                        <input type="date" name="end-release-year" class="end-release-year">
                    </fieldset>
                </form>
            <button class="with-people-toggle">Hide/Show Cast and Crew to include</button>
                <form class="with-people">
                    <fieldset class="with-people">
                        <legend>Cast/Crew</legend>
                        <p>Fan of Tim Burton's eccentric style or Quentin Tarantino's... well, there's no word for Tarantino's style. You can use this feature to find movies with styles similar to your favorite director/writer/actor/whoever.</p>
                        <input type="text" name="with-people-input" class="with-people-input" placeholder="Ex: David Fincher">
                        <input type="submit" name="run-with-people-search" class="with-people-submit-button" value="Find people">
                        <div class="people-results">
                        <div class="error-message"></div>
                        </div>
                    </fieldset>
                </form>
            <form>
                <fieldset class="sort-by">
                    <legend>Sort by</legend>
                    <p>Now for the cherry on top. How would you like to display your results?</p>
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
};

function hideFiltersOnLoad() {
    $("form.with-keyword").toggle();
    $("form.without-keyword").toggle();
    $("form.release-year").toggle();
    $("form.with-people").toggle();
};

function toggleHideAndShowFilters() {
    $("button.with-keyword-toggle").click(function () {
        $("form.with-keyword").toggle();
    });
    $("button.without-keyword-toggle").click(function () {
        $("form.without-keyword").toggle();
    });
    $("button.release-year-toggle").click(function () {
        $("form.release-year").toggle();
    });
    $("button.with-people-toggle").click(function () {
        $("form.with-people").toggle();
    });
};

function displaySearchForm() {
    $("main .form").html(generateSearchForm());
};

function showWithKeywordResults(responseJson) {
    $(".with-keyword-results").append(`<h2>Select your keywords to include:</h2>
        <form>`);
    for (let i = 0; i < responseJson.results.length; i++) {
        $(".with-keyword-results").append(`
                <input type="checkbox" name="with-keyword" value="${responseJson.results[i].id}">${responseJson.results[i].name}
                `);
    };
    $(".with-keyword-results").append("</form>");
};

function searchFilterNotFound() {
    $(".with-keyword-results .error-message").html("No keywords found. Please try a different keyword.");
    $(".without-keyword-results .error-message").html("No keywords found. Please try a different keyword.");
    $(".people-results .error-message").html("No people found. Please try a different name.");
};

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
            };
        });
};

function showWithoutKeywordResults(responseJson) {
    $(".without-keyword-results").append(`<h2>Select your keywords to exclude:</h2>
        <form>`);
    for (let i = 0; i < responseJson.results.length; i++) {
        $(".without-keyword-results").append(`
                <input type="checkbox" name="without-keyword" value="${responseJson.results[i].id}">${responseJson.results[i].name}
                `);
    };
    $(".without-keyword-results").append("</form>");
};

function fetchWithoutKeywordData(value) {
    $(".without-keyword-results .error-message").empty();
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/keyword?query=${value}`, options)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.results.length) {
                showWithoutKeywordResults(responseJson);
            } else {
                searchFilterNotFound();
            };
        });
};

function showPeopleAvailable(responseJson) {
    $(".people-results").append("<h2>Select the cast/crew names you want to include:</h2><form>");
    for (let i = 0; i < responseJson.results.length; i++) {
        $(".people-results").append(`<input type="checkbox" name="with-people" value="${responseJson.results[i].id}">${responseJson.results[i].name}`);
    };
    $(".people-results").append("</form>");
};

function fetchWithPeople(value) {
    $(".people-results .error-message").empty();
    const options = {
        headers: new Headers({
            'Authorization': `Bearer ${tmdbToken}`
        })
    };
    fetch(`https://api.themoviedb.org/3/search/person?query=${value}`, options)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.results.length) {
                showPeopleAvailable(responseJson);
            } else {
                searchFilterNotFound();
            };
        });
};

function displayLoadMoreResultsButton() {
    $("main .fetch-more-films-button").html("<button type='button' name='find-more-films'>Find more films</button>");
};

function displayNewSearchButton() {
    $("main .new-search-button").html("<button type='button' name='start-new-search'>New Search</button>");
};

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
                <section class="title_and_score">
                <h3><span class="title">${responseJson.Title}</span> <span class="reviews">${responseJson.imdbRating}<img src="favorite.png" alt="User rating score."></span></h3>
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

function fetchFilmDetailsFromImdb(imdbId) {
    const imdbOptions = {
        headers: new Headers({
            "X-RapidAPI-Key": "0823bc3d86mshee07fc4e8741c97p13dedcjsn9e48b49e1470"
        })
    };
    fetch(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${imdbId}`, imdbOptions)
        .then((response) => response.json())
        .then((responseJson) => displaySearchResults(responseJson));
};

function fetchMovieDetails(responseJson) {
    $("main .form").empty();
    for (let i = 0; i < responseJson.results.length; i++) {
        displayLoadMoreResultsButton();
        const options = {
            headers: new Headers({
                'Authorization': `Bearer ${tmdbToken}`
            })
        };
        fetch(`https://api.themoviedb.org/3/movie/${responseJson.results[i].id}`, options)
            .then((response) => response.json())
            .then((responseJson) => fetchFilmDetailsFromImdb(responseJson.imdb_id));
    };
};

function noResultsFound() {
    $("main .form").empty();
    $("main .fetch-more-films-button").empty();
    $("main .results").append("Sorry, no films available to display. Try a new search.");
    displayNewSearchButton();
};

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
            };
        });
};

function runKeywordSearch() {
    $("main .form").on("click", ".with-keyword-submit-button", (event) => {
        event.preventDefault();
        const value = $(".with-keyword-input").val();
        fetchWithKeywordData(value);
    });
    $("main .form").on("click", ".without-keyword-submit-button", (event) => {
        event.preventDefault();
        const value = $(".without-keyword-input").val();
        fetchWithoutKeywordData(value);
    });
};

function runPeopleSearch() {
    $("main .form").on("click", ".with-people-submit-button", (event) => {
        event.preventDefault();
        const value = $(".with-people-input").val();
        fetchWithPeople(value);
    });
};

function setWithKeywords() {
    $("main .form").on("change", "input[name=with-keyword]", (event) => {
        const checkedBoxes = $("input[name=with-keyword]:checked");
        const keywordIds = [];
        for (let i = 0; i < checkedBoxes.length; i++) {
            keywordIds.push(checkedBoxes[i].value);
        };
        SEARCH.withKeywords = keywordIds;
    });
};

function setWithoutKeywords() {
    $("main .form").on("change", "input[name=without-keyword]", (event) => {
        const checkedBoxes = $("input[name=without-keyword]:checked");
        const keywordIds = [];
        for (let i = 0; i < checkedBoxes.length; i++) {
            keywordIds.push(checkedBoxes[i].value);
        };
        SEARCH.withoutKeywords = keywordIds;
    });
};

function setReleaseYear() {
    $("main .form").on("change", "input[name=start-release-year]", (event) => {
        const startReleaseYear = $("input[name=start-release-year]").val();
        SEARCH.primaryReleaseDateStart = startReleaseYear;
    });
    $("main .form").on("change", "input[name=end-release-year]", (event) => {
        const endReleaseYear = $("input[name=end-release-year]").val();
        SEARCH.primaryReleaseDateEnd = endReleaseYear;
    });
};

function setPeople() {
    $("main .form").on("change", "input[name=with-people]", (event) => {
        const people = $("input[name=with-people]:checked");
        const peopleIds = [];
        for (let i = 0; i < people.length; i++) {
            peopleIds.push(people[i].value);
        };
        SEARCH.withPeople = peopleIds;
    });
};

function setSortBy() {
    $("main .form").on("change", "select[name=sort-by]", (event) => {
        const sortBy = $("select[name=sort-by]").val();
        SEARCH.sortBy = sortBy;
    });
};

function generateMasterSearchUrlString() {
    const withKeywords = SEARCH.withKeywords.join("|");
    const withoutKeywords = SEARCH.withoutKeywords.join("|");
    const withPeople = SEARCH.withPeople.join("|");
    const masterSearchUrlString = `?with_keywords=${withKeywords}&without_keywords=${withoutKeywords}&primary_release_date.gte=${SEARCH.primaryReleaseDateStart}&primary_release_date.lte=${SEARCH.primaryReleaseDateEnd}&with_people=${withPeople}&sort_by=${SEARCH.sortBy}&page=${SEARCH.page}`;
    fetchMasterSearch(masterSearchUrlString);
};

function runMasterSearch() {
    $("main .form").on("click", ".master-search-submit-button", (event) => {
        event.preventDefault();
        generateMasterSearchUrlString();
    });
};

function fetchMoreFilms() {
    $("main .fetch-more-films-button").on("click", "button[name=find-more-films]", (event) => {
        SEARCH.page += 1;
        $("main .form").append(generateMasterSearchUrlString());
    });
};

function startNewSearch() {
    $("main .new-search-button").on("click", "button[name=start-new-search]", (event) => {
        location.reload();
    });
}

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