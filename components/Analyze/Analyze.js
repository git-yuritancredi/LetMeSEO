import React from 'react';
import {Button, Box, Typography, Grid, TextField} from '@material-ui/core';
import electron from "electron";

export default class Analyze extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            analyzeString: null,
            validUrl: true
        };

        electron.ipcRenderer.on('analyze-done', (event, parser) => {
            console.log(parser.firstChild.toString());
        });
    }

    analyzeHandler(){
        electron.ipcRenderer.send('start-analyze', this.state.analyzeString);
    }

    inputHandler(e){
        this.setState({
            analyzeString: e.target.value,
            validUrl: this.isValidURL(e.target.value)
        })
    }

    isValidURL(str) {
        let pattern = new RegExp('^(https?:\\/\\/)?'+
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
            '((\\d{1,3}\\.){3}\\d{1,3}))'+
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
            '(\\?[;&a-z\\d%_.~+=-]*)?'+
            '(\\#[-a-z\\d_]*)?$','i');
        return !!pattern.test(str);
    }

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
                            <Button variant="contained" color="primary" size="large" onClick={this.analyzeHandler.bind(this)} fullWidth disableElevation>ANALYZE</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Grid className="container" container>
                    <Grid item xs={12}>
                        <TextField id="standard-basic" label="Insert here the url to analyze" error={!this.state.validUrl} onChange={this.inputHandler.bind(this)} variant="outlined" size="small" autoFocus fullWidth/>
                    </Grid>
                </Grid>
            </Box>
         );
    }
}