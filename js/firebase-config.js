const firebaseConfig = {
    apiKey: keys.firebase,
    authDomain: "codeup-zenith.firebaseapp.com",
    projectId: "codeup-zenith",
    storageBucket: "codeup-zenith.appspot.com",
    messagingSenderId: "1006800570152",
    appId: "1:1006800570152:web:b74bebec925b80a56bb21d",
    measurementId: "G-QVQVEBEV2G"
};

class FirebaseDatabase {
    constructor({ team }) {
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.firestore();
        this.collectionName = `movies_${team}`;
        this.createCollection(`movies_${team}`);
    }
    async createCollection(collection) {
        // check to see if the collection has more than 0 documents
        const response = await this.db.collection(collection).get();
        const collections = response.docs;
        // if the collection doesn't exist, create it
        if (collections.length === 0) {
            // create an array of example movies
            const movies = [
                {   
                    title: 'The Shawshank Redemption',
                    year: 1994,
                    director: 'Frank Darabont',
                    rating: 9.3,
                    runtime: 142,
                    genre: 'Drama',
                    actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
                },
                {
                    title: 'The Godfather',
                    year: 1972,
                    director: 'Francis Ford Coppola',
                    rating: 9.2,
                    runtime: 175,
                    genre: 'Crime, Drama',
                    actors: 'Marlon Brando, Al Pacino, James Caan, Diane Keaton',
                },
                {
                    title: 'The Godfather: Part II',
                    year: 1974,
                    director: 'Francis Ford Coppola',
                    rating: 9.0,
                    runtime: 202,
                    genre: 'Crime, Drama',
                    actors: 'Al Pacino, Robert De Niro, Robert Duvall, Diane Keaton',
                },
                {
                    title: 'Ted',
                    year: 2012,
                    director: 'Seth MacFarlane',
                    rating: 6.9,
                    runtime: 106,
                    genre: 'Comedy',
                    actors: 'Mark Wahlberg, Mila Kunis, Seth MacFarlane',
                },
            /**
                {
                    Actors: "Mark Wahlberg, Mila Kunis, Seth MacFarlane",
                    Awards: "Nominated for 1 Oscar. 13 wins & 28 nominations total",
                    BoxOffice: "$218,815,487",
                    Country: "United States",
                    DVD: "11 Dec 2012",
                    Director: "Seth MacFarlane",
                    Genre: "Comedy",
                    Language: "English, Japanese, Ukrainian",
                    Metascore: "62",
                    Plot: "John Bennett, a man whose childhood wish of bringing his teddy bear to life came true, now must decide between keeping the relationship with the bear, Ted or his girlfriend, Lori.",
                    Poster: "https://m.media-amazon.com/images/M/MV5BMTQ1OTU0ODcxMV5BMl5BanBnXkFtZTcwOTMxNTUwOA@@._V1_SX300.jpg",
                    Production: "N/A",
                    Rated: "R",
                    Ratings: [
                            {Source: 'Internet Movie Database', Value: '6.9/10'},
                            {Source: 'Rotten Tomatoes', Value: '69%'},
                            {Source: 'Metacritic', Value: '62/100'}
                         ],
                    Released:"29 Jun 2012",
                    Response:"True",
                    Runtime:"106 min",
                    Title:"Ted",
                    Type:"movie",
                    Website:"N/A",
                    Writer:"Seth MacFarlane, Alec Sulkin, Wellesley Wild",
                    Year:"2012",
                    imdbID:"tt1637725",
                    imdbRating:"6.9",
                    imdbVotes:"620,990"
        }
            */
            ];
            // add the example movies to the collection
            movies.forEach(movie => {
                this.db.collection(collection).add(movie);
            });
        }
    }
    async fetch(url, options) {
        let response, id;
        // Validate options object
        if (!options || !options.method || !options.headers) {
            throw new Error('The options object must include a `method` and `headers` property.');
        }
        if (options.body && typeof options.body !== 'string') {
            throw new Error('The `body` property of the options object must be a string.');
        }
        if (options.body && !options.headers['Content-Type']) {
            throw new Error('The `headers` property of the options object must include a `Content-Type` property.');
        }
        switch (options.method) {
            case 'GET':
                if (url === '/movies') {
                    const snapshot = await this.db.collection(this.collectionName).get();
                    // add the id of each document to the data
                    response = snapshot.docs.map(doc => {
                        const data = doc.data();
                        data.id = doc.id;
                        return data;
                    });
                } else {
                    const id = url.split('/')[2];
                    const doc = await this.db.collection(this.collectionName).doc(id).get();
                    // add the id of the document to the data
                    response = doc.data();
                    response.id = doc.id;
                }
                break;
            case 'POST':
                // check to make sure there isn't a document with the same title
                const checkSnapshot = await this.db.collection(this.collectionName).get();
                const checkDocs = checkSnapshot.docs;
                const titles = checkDocs.map(doc => doc.data().title);
                if (titles.includes(JSON.parse(options.body).title)) {
                    throw new Error(`A movie with the title "${JSON.parse(options.body).title}" already exists.`);
                }
                // add the document
                await this.db.collection(this.collectionName).add(JSON.parse(options.body));
                // get the id of the document just added
                const snapshot = await this.db.collection(this.collectionName).get();
                const docs = snapshot.docs;
                id = docs[docs.length - 1].id;
                response = {id};
                break;
            case 'PUT':
                id = url.split('/')[2];
                await this.db.collection(this.collectionName).doc(id).update(JSON.parse(options.body));
                response = {};
                break;
            case 'DELETE':
                id = url.split('/')[2];
                await this.db.collection(this.collectionName).doc(id).delete();
                response = {};
                break;
            default:
                throw new Error(`Unsupported method: ${options.method}`);
        }

        return Promise.resolve({
            json: () => Promise.resolve(response)
        });
    }
}