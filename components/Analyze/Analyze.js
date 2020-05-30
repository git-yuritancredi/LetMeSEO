import React from 'react';
import {Button, Box, Typography, Grid, TextField} from '@material-ui/core';
import Placeholder from './Placeholder';
import Analysis from "./Analysis";
import electron from "electron";

export default class Analyze extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            analyzeUrl: props.keptData ? props.keptData.analyzedUrl : '',
            validUrl: true,
            analysis: props.keptData ? props.keptData : null,
            analysisPoints: props.keptData ? props.keptData.analysisPoints : null,
            startAnimation: false,
            keepDataHandler: props.keepDataHandler
        };

        electron.ipcRenderer.on('analyze-done', (event, parsedData) => {
            this.setState({
                analysis: parsedData,
                startAnimation: false
            });
            parsedData.analyzedUrl = this.state.analyzeUrl;
            this.state.keepDataHandler('analyze', parsedData);
        });

        electron.ipcRenderer.on('analyze-error', () => {
            this.setState({
                analysis: null,
                startAnimation: false,
            });
        });
    }

    analyzeHandler(){
        if(this.state.analyzeUrl) {
            this.setState({
                startAnimation: true,
                analysis: null
            });
            electron.ipcRenderer.send('start-analyze', this.state.analyzeUrl);
        }else{
            this.setState({
                validUrl: false
            });
        }
    }

    inputHandler(e){
        this.setState({
            analyzeUrl: e.target.value,
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

    clearHandler(){
        this.setState({
            analysis: null
        });
        this.state.keepDataHandler(null, null);
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
                            {
                                this.state.analysis === null ?
                                <Button variant="contained" color="primary" size="large"
                                    onClick={this.analyzeHandler.bind(this)} fullWidth
                                    disableElevation>ANALYZE</Button> :
                                <Button variant="contained" color="primary" size="large"
                                        onClick={this.clearHandler.bind(this)} fullWidth
                                        disableElevation>CLEAR ANALYSIS</Button>
                            }
                        </Grid>
                    </Grid>
                </Box>
                <Grid className="container" container>
                    <Grid item xs={12}>
                        <TextField id="standard-basic" label="Insert here the url to analyze" disabled={this.state.analysis !== null} error={!this.state.validUrl} onChange={this.inputHandler.bind(this)} value={this.state.analyzeUrl} variant="outlined" size="small" autoFocus fullWidth/>
                    </Grid>
                </Grid>
                <Grid className="analysis-conainer" container>
                    <Grid className="analysis-point" xs={12} item>
                        <Box className="container">
                            {
                                this.state.startAnimation ?
                                    <Placeholder /> :
                                (
                                    this.state.analysis ?
                                    <Analysis data={this.state.analysis} /> :
                                    ''
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
         );
    }
}
