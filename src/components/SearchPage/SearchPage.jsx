import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import SearchItem from '../SearchItem/SearchItem';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const dispatch = useDispatch();
    const searcher = useSelector(store => store.searchReducer[0]);


    const mapTest = () => {
        console.log(searcher)
        for (let x = 0; x < searcher.length; x++) {
            console.log(searcher[x].url);
        }
    }

    const search = () => {
        console.log(`Searching for ${searchTerm} on GIPHY`);
        dispatch({
            type: 'FETCH_GIF',
            payload: searchTerm
        });
    };

    // error for this is that the array is null [], so it is trying to map null and cant
    // {searcher.map((testItem) => {
    // return (
    // <SearchItem key={testItem.id} testItem={testItem} />
    // );})}
      
 
    return (
        <>
        <TextField style={{ width: "400px" }} id="outlined-search" label="Search GIPHY" type="search" variant="outlined" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
        <Button style={{ width: "150px", height: "55px" }} variant="contained" color="primary" onClick={search}>Search</Button>
        <Button style={{ width: "150px", height: "55px" }} variant="contained" color="primary" onClick={mapTest}>MAP ME</Button>
        <Grid container spacing={3}>
    
        </Grid>
        </>
    );
};

export default SearchPage;