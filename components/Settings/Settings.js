import React from "react";
import {
    Box,
    Button,
    Grid,
    Typography,
    Divider,
    Switch,
    FormGroup,
    FormControlLabel,
    Select,
    MenuItem
} from "@material-ui/core";
import electron from "electron";
import {i18n} from '../language';

export default class Settings extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            darkMode: this.props.darkModeEnabled,
            saveHistory: this.props.saveHistory ? this.props.saveHistory : true,
			language: this.props.language ? this.props.language : 'en',
            hasChanges: false
        }

        let configs = electron.ipcRenderer.sendSync('get-config');
        if(configs.length > 0){
            configs.map((config) => {
                this.state[config.key] = config.value;
            });
        }
    }

    componentWillUnmount(){
        if(this.state.hasChanges){
            this.saveHandler();
        }
    }

    themeModeHandler(e) {
        this.props.darkMode(e.target.checked);
        this.setState({
            darkMode: e.target.checked,
            hasChanges: true
        });
    }

    historyHandler(e){
        this.setState({
            saveHistory: e.target.checked,
            hasChanges: true
        });
    }

    languageHandler(e) {
        this.setState({
            language: e.target.value,
            hasChanges: true
        });
        i18n.setLocale(e.target.value);
    }

    saveHandler(){
        electron.ipcRenderer.send('save-config', [
            {
                key: 'darkMode',
                value: this.state.darkMode
            },
            {
                key: 'saveHistory',
                value: this.state.saveHistory
            },
			{
				key: 'language',
				value: this.state.language
			}
        ]);
        this.setState({
            hasChanges: false
        });
    }

    render() {
        return (
            <>
                <Box className="heading">
                    <Grid alignItems="center" container>
                        <Grid item xs={9}>
                            <Typography variant="h3" color="textPrimary">{i18n.__("Settings")}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">{i18n.__("Set your preferred settings.")}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" size="large" onClick={this.saveHandler.bind(this)} fullWidth disableElevation>{i18n.__("SAVE SETTINGS")}</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Box className="container">
                    <Box className="form-container">
                        <Box className="single-setting">
                            <Typography variant="subtitle2" color="textSecondary">{i18n.__("Theme mode")}</Typography>
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
                                    label={i18n.__("Dark mode")}
                                    color="default"
                                />
                            </FormGroup>
                        </Box>
                        <Box className="single-setting">
                            <Typography variant="subtitle2" color="textSecondary">{i18n.__("Memorization settings")}</Typography>
                            <Divider variant="fullWidth" />
                            <FormGroup row>
                                <FormControlLabel control={
                                        <Switch
                                            checked={this.state.saveHistory}
                                            onChange={this.historyHandler.bind(this)}
                                            color="primary"
                                            name="saveHistory"
                                            size="small"
                                        />
                                    }
                                    label={i18n.__("Save analyzed sites")}
                                    color="default"
                                />
                            </FormGroup>
                        </Box>
                        <Box className="single-setting last">
                            <Typography variant="subtitle2" color="textSecondary">{i18n.__("Language")}</Typography>
                            <Divider variant="fullWidth" />
                            <FormGroup row>
								<Select
									value={this.state.language}
									onChange={this.languageHandler.bind(this)}
								>
									<MenuItem value="en">{i18n.__("English")}</MenuItem>
									<MenuItem value="it">{i18n.__("Italian")}</MenuItem>
								</Select>
                            </FormGroup>
                        </Box>
                    </Box>
                </Box>
            </>
        );
    }
}
