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
import {connect} from "react-redux";
import {i18n} from '../language';
import {saveConfig, setConfig} from "../slices/configSlice";
import {mapState} from "../store";
import {setLogo} from "../slices/appSlice";
import {DARK_LOGO, DEFAULT_LOGO} from "../costants";

class Settings extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            hasChanges: false
        }
    }

    componentWillUnmount(){
        if(this.state.hasChanges){
            this.saveHandler();
        }
    }

    themeModeHandler(e) {
        this.props.dispatch(setConfig({
            darkMode: e.target.checked,
            saveHistory: this.props.config.saveHistory,
            language: this.props.config.language
        }));
        this.props.dispatch(setLogo(e.target.checked ? DARK_LOGO : DEFAULT_LOGO));
        this.setState({
            hasChanges: true
        });
    }

    historyHandler(e){
        this.props.dispatch(setConfig({
            darkMode: this.props.config.darkMode,
            saveHistory: e.target.checked,
            language: this.props.config.language
        }));
        this.setState({
            hasChanges: true
        });
    }

    languageHandler(e) {
        this.props.dispatch(setConfig({
            darkMode: this.props.config.darkMode,
            saveHistory: this.props.config.saveHistory,
            language: e.target.value
        }));
        this.setState({
            hasChanges: true
        });
        i18n.setLocale(e.target.value);
    }

    saveHandler() {
        this.props.dispatch(
            saveConfig([
                {
                    key: 'darkMode',
                    value: this.props.config.darkMode
                },
                {
                    key: 'saveHistory',
                    value: this.props.config.saveHistory
                },
                {
                    key: 'language',
                    value: this.props.config.language
                }
            ])
        );
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
                                            checked={this.props.config.darkMode}
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
                                            checked={this.props.config.saveHistory}
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
									value={this.props.config.language}
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
export default connect(mapState)(Settings);
