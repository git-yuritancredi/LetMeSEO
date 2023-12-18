import React from "react";
import electron from 'electron';
import {i18n} from "../language";
import {mapState} from "../store";
import {connect} from "react-redux";
import TuneIcon from '@mui/icons-material/Tune';
import GitHubIcon from '@mui/icons-material/GitHub';
import {navigate} from "../slices/navigationSlice";
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import {List, ListItem, Divider, Chip, Avatar, Grid, Badge, ListItemIcon, ListItemText} from "@mui/material";

class AppMenu extends React.Component {
    constructor(props) {
        super(props);

        electron.ipcRenderer.on('change-section', (event, args) => {
            this.changeSectionHandle(args);
        });
    }

    render() {
        return (
            <>
                <img src={this.props.app.logo} onClick={() => {
                    this.changeSectionHandle('analyze')
                }} id="logo"/>
                <Grid direction="column" justifyContent="space-between" alignItems="stretch" className="menu-grid"
                      container>
                    <Grid item>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItem selected={this.props.navigation.section === 'analyze'} onClick={() => {
                                this.changeSectionHandle('analyze')
                            }} button>
                                <ListItemIcon>
                                    {this.props.app.storedAnalysis !== null && this.props.navigation.section !== 'analyze' ?
                                        <Badge color="primary" variant="dot">
                                            <BarChartIcon/>
                                        </Badge> :
                                        <BarChartIcon/>
                                    }
                                </ListItemIcon>
                                <ListItemText primary={i18n.__("Analyze")} secondary={i18n.__("Analyze site SEO")}/>
                            </ListItem>
                            <Divider/>
                            <ListItem selected={this.props.navigation.section === 'history'} onClick={() => {
                                this.changeSectionHandle('history')
                            }} button>
                                <ListItemIcon>
                                    <HistoryIcon/>
                                </ListItemIcon>
                                <ListItemText primary={i18n.__("History")}
                                              secondary={i18n.__("You has analyzed %s sites", this.props.history.items.length)}/>
                            </ListItem>
                            <Divider/>
                            <ListItem selected={this.props.navigation.section === 'settings'} onClick={() => {
                                this.changeSectionHandle('settings')
                            }} button>
                                <ListItemIcon>
                                    <TuneIcon/>
                                </ListItemIcon>
                                <ListItemText primary={i18n.__("Settings")}
                                              secondary={i18n.__("Memory options and more")}/>
                            </ListItem>
                            <Divider/>
                            <ListItem selected={this.props.navigation.section === 'about'} onClick={() => {
                                this.changeSectionHandle('about')
                            }} button>
                                <ListItemIcon>
                                    <GitHubIcon/>
                                </ListItemIcon>
                                <ListItemText primary={i18n.__("GitHub")} secondary={i18n.__("Open source projects")}/>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item className="bottom-picker">
                        <Chip onClick={this.openGitHubPage} avatar={<Avatar src="../assets/images/avatar.jpg"/>}
                              label="@git-yuritancredi"/>
                    </Grid>
                </Grid>
            </>
        );
    }

    changeSectionHandle(newSection) {
        this.props.dispatch(navigate(newSection));
    }

    openGitHubPage() {
        electron.shell.openExternal('https://github.com/git-yuritancredi');
    }
}

export default connect(mapState)(AppMenu);
