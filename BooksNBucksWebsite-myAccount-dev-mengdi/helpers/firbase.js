import {initializeApp} from 'firebase/app'

const config = {
    apiKey: "AIzaSyCa2OiuTmHBj-seoJcU84SZp3Y7gs9p5IY",
    authDomain: "chess-dollars.firebaseapp.com",
    databaseURL: "https://chess-dollars.firebaseio.com",
    projectId: "chess-dollars",
    storageBucket: "chess-dollars.appspot.com",
    messagingSenderId: "839705872303",
    appId: "1:839705872303:web:c69bb7bc38be48b0c9915a",
    measurementId: "G-BSJ3TT1MPE"
};

const initFirebase = () => {
    try {
        initializeApp(config);
    } catch (e) {

    }
}

export default initFirebase