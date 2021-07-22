import React from 'react';
import { useState } from 'react';
import SearchItem from '../SearchItem/SearchItem';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

function SearchItem(item) {
    const classes = useStyles();
    const useStyles = makeStyles((theme) => ({
        root: {
          flexGrow: 1
        },
        paper: {
          padding: theme.spacing(2),
          textAlign: "center",
          color: theme.palette.text.secondary
        }
      }));

    const addFavorite = () => {
        console.log('Adding to favorites', item);
    };

    return (
        <Grid item style={{ maxWidth: "800px", height: "400px" }}>  
          <Paper className={classes.paper}>
            <img src={item.url} />
            <br />
            <Button
              style={{ width: "170px", height: "42px" }}
              variant="contained"
              color="primary"
              onClick={addFavorite}
            >
              Add to Favorites
            </Button>
          </Paper>
        </Grid>
    );
};

export default SearchItem;