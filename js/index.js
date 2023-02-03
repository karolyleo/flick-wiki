(async () => {
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object 
    // with your team name in the "js/movies-api.js" file.
    
    
})();

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
function movieCards(movie) {
    const {title, year, director, rating, runtime, genre, actors, Poster} = movie;
    let HTML = `
    <div id="${formatString(title)}" class="container m-1">
        <div class="flip-card mx-auto">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${Poster}" alt="Avatar" class="img">
                </div>
                <div class="flip-card-back">
                    <h2 class="text-center">${title}</h2>
                    <h6 class="text-center">Director: ${director}</h6>
                    <p class="text-center">Actors: ${actors}</p>
                    <p>Rating: ${rating}</p>
                    <p class="${genre}">Genre: ${genre}</p>
                    <p>RunTime: ${runtime}</p>
                    <p>Year: ${year}</p>
                </div>
            </div>
        </div>
    </div>`;
    return HTML
}

//ID format
function formatString(str) {
    return str.toLowerCase().replace(/\s+/g, '-');
}

async function populateMovies(){
    let tempMovieList = await getMovies();
    console.log(tempMovieList[0]);
    let htmlHelper = '';
    tempMovieList.forEach((movie)=>{htmlHelper+=movieCards(movie)});
    document.getElementById('movieList').innerHTML = htmlHelper;
}