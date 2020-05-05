import React, {useMemo} from 'react';
import { Grid, Box, ThemeProvider, createMuiTheme } from "@material-ui/core";
import Analyze from './../Analyze/Analyze';
import UserToolbar from "../UserToolbar/UserToolbar";
import AppMenu from "../AppMenu/AppMenu";
import About from "../About/About";
import History from "../History/History";
import Settings from "../Settings/Settings";
import electron from 'electron';

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
                    },
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
                MuiFormControlLabel: {
                    label: {
                        color: '#FFFFFF',
                        marginLeft: 10,
                    }
                },
                MuiListItemText: {
                    primary: {
                        color: '#FFFFFF',
                    }
                }
            },
        });
    }

    themeModeHandler(mode){
        this.setState({
            darkMode: mode,
            logo: mode ? this.darkLogo : this.defaultLogo
        });
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
            </ThemeProvider>
        );
    }

    setCurrentSectionHandle(section){
        this.setState({
            selectedSection: section
        });
    }
}