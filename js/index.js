(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object 
    // with your team name in the "js/movies-api.js" file.
    
    // populateMovies()
})();

let singledMovie = '';

//User Checks their searched movie
document.getElementById("potentialMovieSearch").addEventListener("click", async  (e)=>{
    e.preventDefault();
    singledMovie = await getMovieInfo(document.getElementById('potentialMovie').value);

    let htmlHelper = `${movieCards(singledMovie)}
    <div class="container d-flex align-items-center justify-content-center">
        <button id="firebaseMoviePush" class="btn btn-primary w-50 h-25">Add to List</button> 
    </div>`;

    document.getElementById('movieList').innerHTML = htmlHelper;
    console.log(potentialMovie);
});

//buttons that a added to the DOM
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('movieList').addEventListener('click', async function(e) {
        if (e.target.id === 'firebaseMoviePush') {
            console.log(singledMovie);
            await addMovie(singledMovie);
            await populateMovies();
        }
    });
    document.addEventListener('click', function(event) {
        if (event.target.matches('button.deleter')) {
            console.log(event.target.parentElement.parentElement.parentElement.parentElement.IDValue);
        }
    });

});



// document.getElementById('firebaseMoviePush').addEventListener('click', ()=>{
//     console.log('this works')
// })

//TeamB Logo populates all Movies
document.getElementById("showAllMovies").addEventListener("click", populateMovies);


//Find movie info from OM-Data base
async function getMovieInfo(movieName) {
    const apiKey = keys.OMDb;
    const response = await fetch(
        `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(
            movieName
        )}`
    );
    const data = await response.json();
    const { Actors, Director, Genre, Ratings, Runtime, Title, Year, Poster } = data
    // console.log(data)
    let result = {
        title: Title,
        year: Number(Year),
        director: Director,
        rating: Ratings[0].Value ,
        runtime: Runtime,
        genre: Genre,
        actors: Actors,
        Poster
    }
    return result;
}

//HTML format:
function movieCards(movie, index) {
    const {title, year, director, rating, runtime, genre, actors, Poster} = movie;
    console.log(index)
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
                    <button class="btn btn-outline-danger deleter">Delete</button>
                </div>
            </div>
        </div>
    </div>`;
    return HTML
}

async function populateMovies(){
    let tempMovieList = await getMovies();
    // console.log(tempMovieList[0]);
    let htmlHelper = '<div class="d-flex flex-wrap">';
    tempMovieList.forEach((movie, index)=>{htmlHelper+=movieCards(movie, index)});
    htmlHelper+='</div>'
    document.getElementById('movieList').innerHTML = htmlHelper;
}

//smaller helper functions
//ID format
function formatString(str) {
    return str.toLowerCase().replace(/\s+/g, '-');
}