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

        this.defaultLogo    = '../assets/images/logo_light.svg'
        this.darkLogo       = '../assets/images/logo_dark.svg';
        let darkMode        = electron.ipcRenderer.sendSync('system-mode');

        this.state = {
            selectedSection: 'analyze',
            badgedSection: null,
            keptData: null,
            historyData: [],
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
                secondary: {
                    main: '#ffd231',
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
                secondary: {
                    main: '#ffd231',
                }
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

        electron.ipcRenderer.on('analyze-error', (event, error) => {
            this.setState({
                showError: true,
                errorMessage: error.message.toString()
            });
        });

        electron.ipcRenderer.on('history-update', (event, data) => {
            this.setState({
                historyData: data
            });
        });

        electron.ipcRenderer.send('get-history');
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

    keepDataHandler(section, data){
        this.setState({
            badgedSection: section,
            keptData: data
        });
    }

    render() {
        return (
            <ThemeProvider theme={this.state.darkMode ? this.darkTheme : this.defaultTheme}>
                <Grid container className="full-height" id={this.state.darkMode ? 'dark-mode' : 'light-mode'}>
                    <Grid item className="sidebar" xs={3}>
                        <UserToolbar />
                        <AppMenu
                            selected={this.state.selectedSection}
                            badged={this.state.badgedSection}
                            handleChange={this.setCurrentSectionHandle.bind(this)}
                            historyLength={this.state.historyData.length}
                            logo={this.state.logo}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        {
                            this.state.selectedSection === 'analyze' ? <Analyze keptData={this.state.keptData} keepDataHandler={this.keepDataHandler.bind(this)} /> :
                            this.state.selectedSection === 'history' ? <History data={this.state.historyData} keepDataHandler={this.keepDataHandler.bind(this)} /> :
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
