// In this project, we will be using a Firebase database to store our movie data.
// Configuring Firebase is more involved than what is covered in this lesson,
// so we have provided a class that will handle the configuration for you.
let db = new FirebaseDatabase({
    team: "YOUR_TEAM_NAME" // Replace this with your team name
});

// You will use the "db" object to make requests to the database very similarly to how you
// would use the "fetch" function to make requests to an API. The only difference is that
// you will be adding "db" in front of the "fetch" function.
// Example: db.fetch(url, options);

// This API has the following endpoints:
// GET /movies - returns an array of all movies
// GET /movies/{id} - returns a single movie with the given id
// POST /movies - creates a new movie and returns the id of the new movie
// PUT /movies/{id} - updates the movie with the given id
// DELETE /movies/{id} - deletes the movie with the given id

// The "db" object has a "fetch" method that takes a URL and an options object.
// The URL should be one of the endpoints listed above.
// Here is an example of a function that uses the "fetch" method to make a
// GET request to the "/movies" endpoint:
const getMovies = async () => {
    const url = '/movies';
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let response = await db.fetch(url, options);
    return await response.json();
}

// And here is an example of a function that will add a new movie:
const addMovie = async (data) => {
    const url = '/movies';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    let response = await db.fetch(url, options);
    return await response.json();
}

// Here is where you will create your own functions to further interact with the database.
// HAPPY CODING!!!