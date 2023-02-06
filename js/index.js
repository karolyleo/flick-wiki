(async () => {
    // This is the entry point for your application. Write all of your code here. Before you can use the database, you need to configure the "db" object with your team name in the "js/movies-api.js" file.

    //This loads the main list from firebase onto the home page
    updateList();

//helper variables
let singledMovie = '', allMovie =  0, movieIndex = 0;

//When enter or submit is pressed, for Movie Search
document.getElementById("movieFilteredSearch").addEventListener("click", async  (e)=> {
    e.preventDefault();
    updateMovies();
});

//User Checks their searched new Movie
document.getElementById("potentialMovieSearch").addEventListener("click", async  (e)=>{
    e.preventDefault();
    singledMovie = await getMovieInfo(document.getElementById('potentialMovie').value);

    let htmlHelper = `${movieCards(singledMovie)}
    <div class="container d-flex align-items-center justify-content-center">
        <button id="firebaseMoviePush" class="btn btn-primary w-50 h-25">Add to List</button> 
    </div>`;

    document.getElementById('movieList').innerHTML = htmlHelper;
});

//buttons that are added later to the DOM
document.addEventListener('DOMContentLoaded', function() {
    //add to list
    document.getElementById('movieList').addEventListener('click', async function(e) {
        if (e.target.id === 'firebaseMoviePush') {
            await addMovie(singledMovie);
            wait(3000);
            await updateList();
        }
    });
    //delete button
    document.addEventListener('click', async function(event) {
        if (event.target.matches('button.deleter')) {
            movieIndex = event.target.parentElement.parentElement.parentElement.parentElement.parentElement
            let id = movieIndex.id.split('-');
            movieIndex = Number(id[0]);
            await deleteMovie(allMovie[movieIndex]);
            await updateList();
        }
    });

    //edit button
    document.addEventListener('click', async function(event) {
        if (event.target.matches('button.editor')) {
            movieIndex = event.target.parentElement.parentElement.parentElement.parentElement.parentElement
            let id = movieIndex.id.split('-');
            movieIndex = Number(id[0]);
            editMovie(movieIndex);
        }
    });

    //update button is pressed
    document.addEventListener('click', async function(event) {
        if (event.target.matches('button.updater')) {
            event.preventDefault(); //stops from refreshing

            const id = document.querySelector("p").id;
            const Poster = document.querySelector("img").src;
            let title = document.getElementById("title").value || document.getElementById("title").placeholder;
            let year = document.getElementById("year").value || document.getElementById("year").placeholder;
            let director = document.getElementById("director").value || document.getElementById("director").placeholder;
            let rating = document.getElementById("rating").value || document.getElementById("rating").placeholder;
            let runtime = document.getElementById("runtime").value || document.getElementById("runtime").placeholder;
            let genre = document.getElementById("genre").value || document.getElementById("genre").placeholder;
            let actors = document.getElementById("actors").value || document.getElementById("actors").placeholder;

            let result = { id, Poster, title, year, director, rating, runtime, genre, actors };
            await updateMovie(result);
            await updateList();
        }
    });

});

//homepage
document.getElementById("showAllMovies").addEventListener("click", updateList);

//This is to limit the amount of times firebase is hit
async function updateList(){
        allMovie = await getMovies();
        renderMovies(allMovie);
}

//Find movie info from OM-Data base
async function getMovieInfo(movieName) {
    const apiKey = keys.OMDb;
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movieName)}`
    );
    const data = await response.json(), { Actors, Director, Genre, Ratings, Runtime, Title, Year, Poster } = data;

    if (data.Error === 'Movie not found!') alert('Check Spelling');

    return {
        title: Title,
        year: Number(Year),
        director: Director,
        rating: Ratings[0].Value ,
        runtime: Runtime,
        genre: Genre,
        actors: Actors,
        Poster
    };
}

//HTML individual movie format:
function movieCards(movie, index) {
    const {title, year, director, rating, runtime, genre, actors, Poster} = movie;
    let HTML = `
    <div id="${index}-Movie" class="p-0 m-0">
        <div class="flip-card mx-auto">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${Poster}" alt="Avatar" class="img m-4">
                </div>
                <div class="flip-card-back">
                    <h2 class="text-center">${title}</h2>
                    <h6 class="text-center"><i>Director: ${director}</i></h6>
                    <p class="text-center m-0">Actors: ${actors}</p>
                    <p class="m-0">Rating: ${rating}</p>
                    <p class="m-0">RunTime: ${runtime}</p>
                    <p class="m-0">Year: ${year}</p>
                    <p class="${genre} m-0"><b>Genre: ${genre}</b></p>
                    <div>
                    <button class="btn btn-outline-danger deleter">Delete</button>
                    <button class="btn btn-secondary editor">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return HTML
}

//HTML for edit page:
function cardEditor(movie){
    const {title, year, director, rating, runtime, genre, actors, Poster, id} = movie;

    return `
<form class="bg-white m-5 p-3">
  <div>
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" placeholder="${title}">
  </div>
  <div>
    <label for="year">Year:</label>
    <input type="text" id="year" name="year" placeholder="${year}">
  </div>
  <div>
    <label for="director">Director:</label>
    <input type="text" id="director" name="director" placeholder="${director}">
  </div>
  <div>
    <label for="rating">Rating:</label>
    <input type="text" id="rating" name="rating" placeholder="${rating}">
  </div>
  <div>
    <label for="runtime">Runtime:</label>
    <input type="text" id="runtime" name="runtime" placeholder="${runtime}">
  </div>
  <div>
    <label for="genre">Genre:</label>
    <input type="text" id="genre" name="genre" placeholder="${genre}">
  </div>
  <div>
    <label for="actors">Actors:</label>
    <input type="text" id="actors" name="actors" placeholder="${actors}">
  </div>
  <button class="btn btn-primary updater m-3">Update</button>
  <p id="${id}"> id : ${id}</p>
</form> 
<img src="${Poster}" class="m-5 w-25 h-50">
`;
}

//Shows movies in the DOM
function renderMovies(movies = allMovie){
    let htmlHelper = '<div class="d-flex flex-wrap">';
    movies.forEach((movie, index)=>{htmlHelper+=movieCards(movie, index)});
    htmlHelper+='</div>'
    document.getElementById('movieList').innerHTML = htmlHelper;
}

//Little loader
function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(milliseconds);
        }, milliseconds);
    });
}

//this filters the list to show only what is desired.
function updateMovies(e) {
    // e.preventDefault();
    let filteredMovies = [];
    let movieName = document.getElementById('movieFiltered').value;
    filteredMovies = allMovie.filter(movie => {
        return (movie.title.toLowerCase().match(movieName.toLowerCase())); // match() > startWith() since many movies begin with 'The'
    });
    renderMovies(filteredMovies);
}

// this populates the html made for the edit page
function editMovie(index){
    document.getElementById('movieList').innerHTML = cardEditor(allMovie[index]);
}

})();