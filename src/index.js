import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { put, takeEvery, call } from 'redux-saga/core/effects';
import createSagaMiddleware from 'redux-saga/core';
import logger from 'redux-logger';
import axios from 'axios';
import { response } from 'express';


// The watcher saga
const sagaMiddleware = createSagaMiddleware();
function* watcherSaga() {
    yield takeEvery('FETCH_GIF', getGiphys)
    yield takeEvery('ADD_FAVORITE', getFavorites);
    // yield takeEvery('')
}

// Saga's go here
function* getGiphys() {
    try {
        const giphyResponse = yield axios.get('/api');
        yield put({type: 'GET_GIF'});
    }
    catch(error) {
        console.log('Error in getGiphys', error);
    }
}

function* postGiphys() {
    try {
        yield call(axios.post('/', action.payload));
        yield put({type: 'FETCH_GIF'});
    }
    catch(error) {
        console.log('Error trying to post', error);
    }
}

// saga for when favorite is picked
function* gifFavorite(action) {
    try {
        yield call(axios.post, '/', action.payload);
        yield put({type: 'ADD_FAVORITE'});
    }
    catch(error) {
        console.log('Error trying to pick favorite', error);
    }
}

//GETs favorite database and sets favorites
function* getFavorites() {
    try {
        const favResponse = yield axios.get('/')
        // Need to add spot for SET_FAVORITES to be called
        yield put({type: 'SET_FAVORITES', payload: response.data})
    }
    catch (error) {
        console.log('Error getting favorites', error);
    }
}

//saga for the category
function* gifCategory() {
    try {
        yield call(axios.post, '/', action.payload);
        yield put({type: 'ADD_CATEGORY'});
    }
    catch(error) {
        console.log('Error putting into category', error);
    }
}
//Put saga for the updating of category on gif list


//reducers go here
const searchReducer = (state = '', action) => {
    switch (action.type) {
        case "GET_GIF":
            console.log('Getting GIF', action.payload.data);
            let searchResults = [];
            let results = action.payload.data;
            for (let gif of results) {
                console.log(gif);
                searchResults.spread(...state, {url: gif.url, id: gif.id});
            }
            return searchResults;
        default:
            return state;
    };
};

const favoriteReducer = (state = [], action) => {
    switch (action.type) {
        case "ADD_FAVORITE":
            console.log(`Trying to add ${action.payload} to favorites`);
            state.spread(...state, action.payload);
            return state;

        case "REMOVE_FAVORITE":
            console.log(`Trying to remove ${action.payload} from favorites`);
            return state;

        default:
            return state;
    };
};


// Store instance

const store = createStore(
    combineReducers({
      
    }),
    applyMiddleware(sagaMiddleware, logger),
  );
  
  sagaMiddleware.run(watcherSaga);



ReactDOM.render(<Provider>
    <App />
</Provider>, document.getElementById('root'));
