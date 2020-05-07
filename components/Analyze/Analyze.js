import React from 'react';
import {Button, Box, Typography, Grid, TextField} from '@material-ui/core';
import Placeholder from './Placeholder';
import electron from "electron";

export default class Analyze extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            analyzeString: null,
            validUrl: true,
            analysisString: null,
            analysisPoints: null,
            startAnimation: false
        };

        electron.ipcRenderer.on('analyze-done', (event, parsedData) => {
            console.log(parsedData);
            this.setState({
                analysisString: parsedData.asString,
                analysisPoints: parsedData.analyzed,
                startAnimation: false
            });
        });
    }

    analyzeHandler(){
        this.setState({
            startAnimation: "wave"
        });
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
                <Grid className="analysis-conainer" container>
                    <Grid className="analysis-point" xs={4} item>
                        <Box className="container">
                        </Box>
                    </Grid>
                    <Grid className={this.state.analysisString ? 'analysis-view' : 'analysis-view no-scroll'} xs={8} item>
                        <Box className="stiker"></Box>
                        {
                            this.state.analysisString ? <pre>{this.state.analysisString}</pre> : <Placeholder animation={this.state.startAnimation} />
                        }
                    </Grid>
                </Grid>
            </Box>
         );
    }
}