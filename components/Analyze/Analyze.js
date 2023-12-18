import React from 'react';
import electron from "electron";
import {i18n} from '../language';
import Analysis from "./Analysis";
import {mapState} from "../store";
import {connect} from "react-redux";
import Placeholder from './Placeholder';
import {setStoredAnalysis} from "../slices/appSlice";
import {Button, Box, Typography, Grid, TextField} from '@mui/material';

class Analyze extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            analyzeUrl: props.app.storedAnalysis ? props.app.storedAnalysis.analyzedUrl : '',
            validUrl: true,
            startAnimation: false,
            keepDataHandler: props.keepDataHandler
        };

        electron.ipcRenderer.on('analyze-done', (event, parsedData) => {
            const data = {...parsedData};
            this.setState({
                startAnimation: false
            });
            data.analyzedUrl = this.state.analyzeUrl;
            this.props.dispatch(setStoredAnalysis(data));
        });

        electron.ipcRenderer.on('analyze-error', () => {
            this.setState({
                startAnimation: false,
            });
            this.props.dispatch(setStoredAnalysis(null));
        });
    }

    analyzeHandler() {
        if (this.state.analyzeUrl) {
            this.setState({
                startAnimation: true
            });
            this.props.dispatch(setStoredAnalysis(null));
            electron.ipcRenderer.send('start-analyze', this.state.analyzeUrl);
        } else {
            this.setState({
                validUrl: false
            });
        }
    }

    inputHandler(e) {
        this.setState({
            analyzeUrl: e.target.value,
            validUrl: this.isValidURL(e.target.value)
        })
    }

    isValidURL(str) {
        let pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return !!pattern.test(str);
    }

    clearHandler() {
        this.props.dispatch(setStoredAnalysis(null));
    }

    render() {
        return (
            <Box className="content-container">
                <Box className="heading">
                    <Grid alignItems="center" container>
                        <Grid item xs={9}>
                            <Typography variant="h3" color="textPrimary">{i18n.__("Analyze")}</Typography>
                            <Typography variant="subtitle1"
                                        color="textSecondary">{i18n.__("Insert in the form below the URL to analyze")}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            {
                                this.props.app.storedAnalysis === null ?
                                    <Button variant="contained" color="primary" size="large"
                                            onClick={this.analyzeHandler.bind(this)} fullWidth
                                            disableElevation>{i18n.__("ANALYZE")}</Button> :
                                    <Button variant="contained" color="primary" size="large"
                                            onClick={this.clearHandler.bind(this)} fullWidth
                                            disableElevation>{i18n.__("CLEAR ANALYSIS")}</Button>
                            }
                        </Grid>
                    </Grid>
                </Box>
                <Grid className="container" container>
                    <Grid item xs={12}>
                        <TextField id="standard-basic" label={i18n.__("Insert here the url to analyze")}
                                   disabled={this.props.app.storedAnalysis !== null} error={!this.state.validUrl}
                                   onChange={this.inputHandler.bind(this)} value={this.state.analyzeUrl}
                                   variant="outlined" size="small" autoFocus fullWidth/>
                    </Grid>
                </Grid>
                <Grid className="analysis-conainer" container>
                    <Grid className="analysis-point" xs={12} item>
                        <Box className="container">
                            {
                                this.state.startAnimation ?
                                    <Placeholder/> :
                                    (
                                        this.props.app.storedAnalysis ?
                                            <Analysis data={this.props.app.storedAnalysis}/> :
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

export default connect(mapState)(Analyze)
