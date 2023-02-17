import React from "react";
import {
    List,
    Divider,
    Chip,
    Avatar,
    Grid,
    Badge,
    ListItemIcon,
    ListItemText,
    ListItemButton
} from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';
import HistoryIcon from '@mui/icons-material/History';
import TuneIcon from '@mui/icons-material/Tune';
import GitHubIcon from '@mui/icons-material/GitHub';
import electron from 'electron';
import {connect} from "react-redux";
import {i18n} from "../language";
import {navigate} from "../slices/navigationSlice";
import {mapState} from "../store";

class AppMenu extends React.Component
{
    constructor(props) {
        super(props);

        electron.ipcRenderer.on('change-section', (event, args) => {
            this.changeSectionHandle(args);
        });
    }

    render() {
        return (
            <>
                <img src={this.props.app.logo} onClick={() => { this.changeSectionHandle('analyze') }} id="logo" />
                <Grid direction="column" justifyContent="space-between" alignItems="stretch" className="menu-grid" container>
                    <Grid item>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItemButton selected={this.props.navigation.section === 'analyze'} onClick={() => { this.changeSectionHandle('analyze') }}>
                                <ListItemIcon>
                                    { this.props.app.storedAnalysis !== null && this.props.navigation.section !== 'analyze' ?
                                        <Badge color="primary" variant="dot">
                                            <BarChartIcon/>
                                        </Badge> :
                                        <BarChartIcon/>
                                    }
                                </ListItemIcon>
                                <ListItemText primary={i18n.__("Analyze")} secondary={i18n.__("Analyze site SEO")} />
                            </ListItemButton>
                            <Divider />
                            <ListItemButton selected={this.props.navigation.section === 'history'} onClick={() => { this.changeSectionHandle('history') }}>
                                <ListItemIcon>
                                    <HistoryIcon />
                                </ListItemIcon>
                                <ListItemText primary={i18n.__("History")} secondary={i18n.__("You has analyzed %s sites", this.props.history.items.length)} />
                            </ListItemButton>
                            <Divider />
                            <ListItemButton selected={this.props.navigation.section === 'settings'} onClick={() => { this.changeSectionHandle('settings') }}>
                                <ListItemIcon>
                                    <TuneIcon />
                                </ListItemIcon>
                                <ListItemText primary={i18n.__("Settings")} secondary={i18n.__("Memory options and more")} />
                            </ListItemButton>
                            <Divider />
                            <ListItemButton selected={this.props.navigation.section === 'about'} onClick={() => { this.changeSectionHandle('about') }}>
                                <ListItemIcon>
                                    <GitHubIcon />
                                </ListItemIcon>
                                <ListItemText primary={i18n.__("GitHub")} secondary={i18n.__("Open source projects")} />
                            </ListItemButton>
                        </List>
                    </Grid>
                    <Grid item className="bottom-picker">
                        <Chip onClick={this.openGitHubPage} avatar={<Avatar src="../assets/images/avatar.jpg" />} label="@git-yuritancredi" />
                    </Grid>
                </Grid>
            </>
        );
    }

    changeSectionHandle(newSection){
        this.props.dispatch(navigate(newSection));
    }

    openGitHubPage(){
        electron.shell.openExternal('https://github.com/git-yuritancredi');
    }
}

export default connect(mapState)(AppMenu);
