import React, {useMemo} from 'react';
import { Grid, Snackbar, ThemeProvider, createMuiTheme } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import electron from 'electron';

import Analyze from './../Analyze/Analyze';
import UserToolbar from "../UserToolbar/UserToolbar";
import AppMenu from "../AppMenu/AppMenu";
import About from "../About/About";
import History from "../History/History";
import Settings from "../Settings/Settings";

export default class Main extends React.Component
{
    constructor(props) {
        super(props);

        this.defaultLogo    = '../app/assets/images/logo_light.svg'
        this.darkLogo       = '../app/assets/images/logo_dark.svg';
        let darkMode        = electron.ipcRenderer.sendSync('system-mode');

        this.state = {
            selectedSection: 'analyze',
            darkMode: darkMode,
            logo: darkMode ? this.darkLogo : this.defaultLogo,
            showSuccess: false,
            successMessage: null,
            showError: false,
            errorMessage: null
        };

        this.defaultTheme = createMuiTheme({
            palette: {
                type: 'light',
                primary: {
                    main: '#424C55',
                },
            },
            overrides: {
                MuiFormControlLabel: {
                    label: {
                        marginLeft: 10,
                        fontSize: 14
                    },
                },
                MuiSwitch: {
                    root: {
                        marginLeft: 10,
                    }
                },
                MuiListItem: {
                    root: {
                        "&$selected": {
                            backgroundColor: "#D3D0CB",
                        },
                    },
                },
                MuiTypography: {
                    root: {
                        "&$colorTextPrimary": {
                            color: "#424C55",
                        },
                        "&$colorTextSecondary": {
                            color: "#54616c",
                        }
                    },
                },
            },
        });

        this.darkTheme = createMuiTheme({
            palette: {
                type: 'dark',
                primary: {
                    main: '#49BEAA',
                },
            },
            overrides: {
                MuiButton: {
                    label: {
                        color: "#FFFFFF",
                    }
                },
                MuiSwitch: {
                    root: {
                        marginLeft: 10,
                    }
                },
                MuiFormControlLabel: {
                    label: {
                        color: '#ffffffb3',
                        marginLeft: 10,
                        fontSize: 14
                    }
                },
                MuiListItemText: {
                    primary: {
                        color: '#FFFFFF',
                    }
                }
            },
        });

        electron.ipcRenderer.on('save-done', (event, value) => {
            if(value){
                this.setState({
                    showSuccess: true,
                    successMessage: "Configuration saved."
                });
            }else{
                this.setState({
                    showError: true,
                    errorMessage: "Unable to save configuration."
                });
            }
        });
    }

    themeModeHandler(mode){
        this.setState({
            darkMode: mode,
            logo: mode ? this.darkLogo : this.defaultLogo
        });
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
            <ThemeProvider theme={this.state.darkMode ? this.darkTheme : this.defaultTheme}>
                <Grid container className="full-height" id={this.state.darkMode ? 'dark-mode' : 'light-mode'}>
                    <Grid item className="sidebar" xs={3}>
                        <UserToolbar />
                        <AppMenu selected={this.state.selectedSection} handleChange={this.setCurrentSectionHandle.bind(this)} logo={this.state.logo} />
                    </Grid>
                    <Grid item xs={9}>
                        {
                            this.state.selectedSection === 'analyze' ? <Analyze /> :
                            this.state.selectedSection === 'history' ? <History /> :
                            this.state.selectedSection === 'settings' ? <Settings darkMode={this.themeModeHandler.bind(this)} darkModeEnabled={this.state.darkMode} /> :
                            this.state.selectedSection === 'about' ? <About /> : ''
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

    setCurrentSectionHandle(section){
        this.setState({
            selectedSection: section
        });
    }
}