import React from "react";
import {Box, Button, Grid, Typography, Divider, Switch, FormGroup, FormControlLabel} from "@material-ui/core";
import electron from "electron";

export default class Settings extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            darkMode: this.props.darkModeEnabled
        }
    }

    themeModeHandler(e) {
        this.props.darkMode(e.target.checked);
        this.setState({
            darkMode: e.target.checked
        });
    }

    saveHandler(){
        electron.ipcRenderer.send('save-config', [{
            key: 'darkMode',
            value: this.state.darkMode
        }]);
    }

    render() {
        return (
            <>
                <Box className="heading">
                    <Grid alignItems="center" container>
                        <Grid item xs={9}>
                            <Typography variant="h3" color="textPrimary">Settings</Typography>
                            <Typography variant="subtitle1" color="textSecondary">Change memorization settings, app theme and more...</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" size="large" onClick={this.saveHandler.bind(this)} fullWidth disableElevation>SAVE SETTINGS</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Box className="container">
                    <Box className="form-container">
                        <Typography variant="subtitle2" color="textSecondary">Theme mode</Typography>
                        <Divider variant="fullWidth" />
                        <FormGroup row>
                            <FormControlLabel control={
                                    <Switch
                                        checked={this.state.darkMode}
                                        onChange={this.themeModeHandler.bind(this)}
                                        color="primary"
                                        name="themeMode"
                                        size="small"
                                    />
                                }
                                label="Dark mode"
                                color="default"
                            />
                        </FormGroup>
                        <Typography variant="subtitle2" color="textSecondary">Memorization settings</Typography>
                        <Divider variant="fullWidth" />
                        <FormGroup row>
                            <FormControlLabel control={
                                <Switch
                                    checked={true}
                                    color="primary"
                                    name="saveHistory"
                                    size="small"
                                />
                            }
                            label="Save analyzed sites"
                            color="default"
                            />
                        </FormGroup>
                    </Box>
                </Box>
            </>
        );
    }
}