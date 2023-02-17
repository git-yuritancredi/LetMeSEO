import React from 'react';
import { Grid, Snackbar, Alert, ThemeProvider, createTheme } from "@mui/material";
import electron from 'electron';
import {connect} from 'react-redux';

import Analyze from './../Analyze/Analyze';
import UserToolbar from "../UserToolbar/UserToolbar";
import AppMenu from "../AppMenu/AppMenu";
import About from "../About/About";
import History from "../History/History";
import Settings from "../Settings/Settings";
import {i18n} from '../language';
import {mapState} from "../store";
import {setConfig} from "../slices/configSlice";
import {setLogo} from "../slices/appSlice";
import {setHistory} from "../slices/historySlice";
import {DARK_LOGO, DEFAULT_LOGO} from "../costants";

class Main extends React.Component
{
    constructor(props) {
        super(props);
        let darkMode        = electron.ipcRenderer.sendSync('system-mode');

        this.props.dispatch(setConfig({
            darkMode: darkMode,
            saveHistory: true,
            language: 'en'
        }));

        this.props.dispatch(setLogo(
            darkMode ? DARK_LOGO : DEFAULT_LOGO,
        ));

        this.state = {
            showSuccess: false,
            successMessage: null,
            showError: false,
            errorMessage: null
        };

        this.defaultTheme = createTheme({
            palette: {
                mode: 'light',
                primary: {
                    main: '#424C55'
                },
                secondary: {
                    main: '#ffd231'
                },
            },
            components: {
                MuiFormControlLabel: {
                    styleOverrides: {
                        label: {
                            marginLeft: 10,
                            fontSize: 14
                        }
                    }
                },
                MuiSwitch: {
                    styleOverrides: {
                        root: {
                            marginLeft: 10
                        }
                    }
                },
                MuiListItemButton: {
                    styleOverrides: {
                        root: {
                            "&$selected": {
                                backgroundColor: "#D3D0CB"
                            }
                        }
                    }
                },
                MuiTypography: {
                    styleOverrides: {
                        root: {
                            "&$colorTextPrimary": {
                                color: "#424C55"
                            },
                            "&$colorTextSecondary": {
                                color: "#54616c"
                            }
                        }
                    }
                }
            }
        });

        this.darkTheme = createTheme({
            palette: {
                mode: 'dark',
                primary: {
                    main: '#49BEAA'
                },
                secondary: {
                    main: '#ffd231'
                }
            },
            components: {
                MuiListItemButton: {
                    styleOverrides: {
                        label: {
                            color: "#FFFFFF"
                        }
                    }
                },
                MuiSwitch: {
                    styleOverrides: {
                        root: {
                            marginLeft: 10
                        }
                    }
                },
                MuiFormControlLabel: {
                    styleOverrides: {
                        label: {
                            color: '#ffffffb3',
                            marginLeft: 10,
                            fontSize: 14
                        }
                    }
                },
                MuiListItemText: {
                    styleOverrides: {
                        primary: {
                            color: '#FFFFFF'
                        }
                    }
                }
            }
        });

        electron.ipcRenderer.on('save-done', (event, value) => {
            if(value){
                this.setState({
                    showSuccess: true,
                    successMessage: i18n.__("Configuration saved.")
                });
            }else{
                this.setState({
                    showError: true,
                    errorMessage: i18n.__("Unable to save configuration.")
                });
            }
        });

        electron.ipcRenderer.on('analyze-error', (event, error) => {
            this.setState({
                showError: true,
                errorMessage: error.message.toString()
            });
        });

        electron.ipcRenderer.on('history-update', (event, data) => {
            this.props.dispatch(setHistory(data));
        });

        electron.ipcRenderer.send('get-history');

        let configs = electron.ipcRenderer.sendSync('get-config');
        if(configs.length > 0){
            const configurations = {};
            configs.forEach((config) => {
                configurations[config.key] = config.value;
                if(config.key === 'language') {
                    i18n.setLocale(config.value);
                }
                if(config.key === 'darkMode') {
                    this.props.dispatch(setLogo(
                        config.value ? DARK_LOGO : DEFAULT_LOGO,
                    ));
                }
            });
            this.props.dispatch(setConfig(configurations));
        }
    }

    resetAlert(){
        this.setState({
            showError: false,
            errorMessage: null,
            showSuccess: false,
            successMessage: null
        })
    }

    render() {
        return (
            <ThemeProvider theme={this.props.config.darkMode ? this.darkTheme : this.defaultTheme}>
                <Grid container className="full-height" id={this.props.config.darkMode ? 'dark-mode' : 'light-mode'}>
                    <Grid item className="sidebar" xs={3}>
                        <UserToolbar />
                        <AppMenu />
                    </Grid>
                    <Grid item xs={9}>
                        {
                            this.props.navigation.section === 'analyze' ? <Analyze /> :
                            this.props.navigation.section === 'history' ? <History /> :
                            this.props.navigation.section === 'settings' ? <Settings /> :
                            this.props.navigation.section === 'about' ? <About /> : ''
                        }
                    </Grid>
                </Grid>
                <Snackbar open={this.state.showSuccess} autoHideDuration={5000} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} onClose={this.resetAlert.bind(this)}>
                    <Alert elevation={1} severity="success">
                        {this.state.successMessage}
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.showError} autoHideDuration={5000} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} onClose={this.resetAlert.bind(this)}>
                    <Alert elevation={1} severity="error">
                        {this.state.errorMessage}
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        );
    }
}

export default connect(mapState)(Main);
