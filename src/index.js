import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.js';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import axios from 'axios';
require('dotenv').config();
import createSagaMiddleware from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';


// The watcher saga
const sagaMiddleware = createSagaMiddleware();
function* watcherSaga() {
    yield takeEvery('GET_CATEGORIES', getCategories);
    yield takeEvery('POST_CATEGORY', addCategory);
    yield takeEvery('PUT_CATEGORY', updateCategory);
    yield takeEvery('DELETE_CATEGORY', deleteCategory);
    yield takeEvery('ADD_FAVORITE', gifFavorite)
    yield takeEvery('GET_FAVORITES', getFavorites);
    yield takeEvery('SEARCH', searchGiphys);
    yield takeEvery('FETCH_NEXTPAGE', getNextGiphys); // listens for FETCH_GIF_NEXTPAGE requests, which are sent from searchPage
    yield takeEvery('FETCH_LASTPAGE', getPreviousGiphys); // listens for FETCH_GIF_LASTPAGE requests, which are sent from searchPage
    // yield takeEvery('ADD_FAVORITE', getFavorites);
    // yield takeEvery('')
};
// Saga's go here
function* searchGiphys(searchQuery) { // takes searchQuery from searchPage input and passes it into the saga
    // console.log('in getGiphys', searchQuery.payload); //test function to make sure data is correct
    try {
        const giphyResponse = yield axios.get(`/api/favorite/${searchQuery.payload}/search`);
        //console.log('getGiphys has payload:', giphyResponse.data.data, 'now attempting to post'); //test function to make sure data is correct
        console.log('getGiphys has payload:', giphyResponse.data.data, 'now attempting to post'); //test function to make sure data is correct
        yield put({type: 'DISPLAY_GIFS', payload: giphyResponse.data.data}); // sends our response data over to POST_GIFTS
    }
    catch(error) {
        console.log('Error in getGiphys', error);
    };
};
function* getPreviousGiphys(searchQuery) { // takes searchQuery from searchPage input and passes it into the saga
    // console.log('in getGiphys', searchQuery.payload); //test function to make sure data is correct
    try {
        const giphyResponse = yield axios.get(`/api/favorite/${searchQuery.payload}/last`);
        //console.log('getGiphys has payload:', giphyResponse.data.data, 'now attempting to post'); //test function to make sure data is correct
        yield put({type: 'DISPLAY_GIFS', payload: giphyResponse.data.data}); // sends our response data over to POST_GIFTS
    }
    catch(error) {
        console.log('Error in getGiphys', error);
    };
};
function* getNextGiphys(searchQuery) { // takes searchQuery from searchPage input and passes it into the saga
    // console.log('in getGiphys', searchQuery.payload); //test function to make sure data is correct
    try {
        const giphyResponse = yield axios.get(`/api/favorite/${searchQuery.payload}/next`);
        //console.log('getGiphys has payload:', giphyResponse.data.data, 'now attempting to post'); //test function to make sure data is correct
        yield put({type: 'DISPLAY_GIFS', payload: giphyResponse.data.data}); // sends our response data over to POST_GIFTS
    }
    catch(error) {
        console.log('Error in getGiphys', error);
    };
};


function* postGiphys(action) { // saga for posting our retrieved GIFs to the DOM
    try {
        // console.log('attempting to post', action.payload) test function to make sure data is correct
        yield call(axios.post('/', action.payload));
        yield put({type: 'FETCH_GIF'}); // posts our data and then sends a FETCH_GIF request for further processing
    }
    catch(error) {
        console.log('Error trying to post', error);
    };
};

// saga for when favorite is picked
function* gifFavorite(action) {
    try {
        yield call(axios.post, '/api/favorite', action.payload);
        
    }
    catch(error) {
        console.log('Error trying to pick favorite', error);
    };
};

//GETs favorite database and sets favorites
function* getFavorites() {
    try {
        const favResponse = yield axios.get('/api/table')
        // Need to add spot for SET_FAVORITES to be called
        yield put({type: 'SET_FAVORITES', payload: favResponse.data});
    }
    catch (error) {
        console.log('Error getting favorites', error);
    };
};

//GETs categories list from db
function* getCategories() {
    try {
        const catResponse = yield axios.get('/api/category')
        // Need to add spot for SET_CATEGORIES to be called
        yield put({type: 'SET_CATEGORIES', payload: catResponse.data});
    }
    catch (error) {
        console.log('Error getting favorites', error);
    };
};

function* addCategory(action) {
    try {
        yield call(axios.post, '/api/category', action.payload);
        yield put({type: 'GET_CATEGORIES'});
    }
    catch(error) {
        console.log('Error trying to pick favorite', error);
    };
};

function* updateCategory(action) {
    try {
        yield call(axios.put, `/api/category/${action.payload.id}`, action.payload);
        yield put({type: 'GET_CATEGORIES'});
    }
    catch(error) {
        console.log('Error trying to pick favorite', error);
    };
};

function* deleteCategory(action) {
    try {
        yield call(axios.delete, `/api/category/${action.payload.id}`);
        yield put({type: 'GET_CATEGORIES'});
    }
    catch(error) {
        console.log('Error trying to pick favorite', error);
    };
};

//saga for the category
function* gifCategory() {
    try {
        yield call(axios.post, '/', action.payload);
        yield put({type: 'ADD_CATEGORY'});
    }
    catch(error) {
        console.log('Error putting into category', error);
    };
};
//Put saga for the updating of category on gif list


//reducers go here
const searchReducer = (state = [], action) => {
    switch (action.type) {
        case "DISPLAY_GIFS": // listening for DISPLAY_GIFS actions
            // console.log('Getting GIF', action.payload); test function to make sure data is correct
            let returnArray = []; // empty array since having state as default array breaks everything
            let results = action.payload; // variable to hold data
            for (let x = 0; x < results.length; x++) { // loops through our data
                //console.log(results[x].title); test function to make sure data is correct
                returnArray.push({id: results[x].id, url: results[x].images.fixed_height.url, title: results[x].title, category_id: 0}); // pushes an object with a unique id and url into our array
                //results[x].images.fixed_height_still.url test function to make sure data is correct
                // console.log(returnArray);// test function to make sure data is correct
            };
            return returnArray // sends our new array back as a response when called
        default:
            return state;
    };
};

const displacementReducer = (state = [], action) => {
    let offset = 0
    switch (action.type) {
        case "DISPLACE":
            return offset+=50;
        default:
            return state;
    }
}

const favoriteReducer = (state = [], action) => {
    switch (action.type) {
        // case "ADD_FAVORITE":
        //     console.log(`Trying to add ${action.payload} to favorites`);
        //     return [...state, action.payload];

        case "REMOVE_FAVORITE":
            console.log(`Trying to remove ${action.payload} from favorites`);
            return state;

        default:
            return state;
    };
};


const showFavoritesReducer = (state = [], action) => {
    console.log('action payload', action.payload);
    if( action.type === 'SET_FAVORITES'){
    return state = action.payload;
    console.log('what is this',state[0]);
}
return state;
}

const categoryReducer = (state = [], action) => {
    switch (action.type) {
        case "SET_CATEGORIES":
            // console.log("categories from db:", action.payload);
            return action.payload;
        //This is a stretch goal
        case "EDIT_CATEGORY":
            console.log(`Trying to edit ${action.payload} category`);
            return [...state, action.payload];//might need to change
        //This is a stretch goal
        case "DELETE_CATEGORY":
            console.log(`Trying to delete ${action.payload} category`);
            return state;
        default:
            return state;
    }
}

// Store instance
const storeInstance = createStore(
    combineReducers({
        searchReducer,
        favoriteReducer,
        categoryReducer,
        showFavoritesReducer
     }),
    applyMiddleware(sagaMiddleware, logger),
  );
  
sagaMiddleware.run(watcherSaga);



ReactDOM.render(<Provider store={storeInstance}>
    <App />
</Provider>, document.getElementById('root'));
