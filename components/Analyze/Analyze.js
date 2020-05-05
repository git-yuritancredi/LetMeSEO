import React from 'react';
import {Button, Box, Typography, Grid, TextField} from '@material-ui/core';

export default class Analyze extends React.Component
{
    render() {
        return (
            <Box className="content-container">
                <Box className="heading">
                    <Grid alignItems="center" container>
                        <Grid item xs={9}>
                            <Typography variant="h3" color="textPrimary">Analyze</Typography>
                            <Typography variant="subtitle1" color="textSecondary">Insert in the form below the URL to analyze</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" size="large" fullWidth disableElevation>ANALYZE</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Grid className="container" container>
                    <Grid item xs={12}>
                        <TextField id="standard-basic" label="Insert here the url to analyze" variant="outlined" size="small" autoFocus fullWidth/>
                    </Grid>
                </Grid>
            </Box>
         );
    }
}