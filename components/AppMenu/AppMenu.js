import React from "react";
import { List, ListItem, Divider, Chip, Avatar, Grid, Badge, ListItemIcon, ListItemText } from "@material-ui/core";
import BarChartIcon from '@material-ui/icons/BarChart';
import HistoryIcon from '@material-ui/icons/History';
import TuneIcon from '@material-ui/icons/Tune';
import GitHubIcon from '@material-ui/icons/GitHub';
import electron from 'electron';

export default class AppMenu extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <img src={this.props.logo} onClick={() => { this.changeSectionHandle('analyze') }} id="logo" />
                <Grid direction="column" justify="space-between" alignItems="stretch" className="menu-grid" container>
                    <Grid item>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItem selected={this.props.selected === 'analyze'} onClick={() => { this.changeSectionHandle('analyze') }} button>
                                <ListItemIcon>
                                    { this.props.badged === 'analyze' && this.props.selected !== 'analyze' ?
                                        <Badge color="primary" variant="dot">
                                            <BarChartIcon/>
                                        </Badge> :
                                        <BarChartIcon/>
                                    }
                                </ListItemIcon>
                                <ListItemText primary="Analyze" secondary="Analyze site SEO" />
                            </ListItem>
                            <Divider />
                            <ListItem selected={this.props.selected === 'history'} onClick={() => { this.changeSectionHandle('history') }} button>
                                <ListItemIcon>
                                    <HistoryIcon />
                                </ListItemIcon>
                                <ListItemText primary="History" secondary={"You has analyzed " + this.props.historyLength + " sites"} />
                            </ListItem>
                            <Divider />
                            <ListItem selected={this.props.selected === 'settings'} onClick={() => { this.changeSectionHandle('settings') }} button>
                                <ListItemIcon>
                                    <TuneIcon />
                                </ListItemIcon>
                                <ListItemText primary="Settings" secondary="Memory options and more" />
                            </ListItem>
                            <Divider />
                            <ListItem selected={this.props.selected === 'about'} onClick={() => { this.changeSectionHandle('about') }} button>
                                <ListItemIcon>
                                    <GitHubIcon />
                                </ListItemIcon>
                                <ListItemText primary="GitHub" secondary="Open source projects" />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item className="bottom-picker">
                        <Chip onClick={this.openGitHubPage} avatar={<Avatar src="assets/images/avatar.jpg" />} label="@git-yuritancredi" />
                    </Grid>
                </Grid>
            </>
        );
    }

    changeSectionHandle(newSection){
        this.props.handleChange(newSection);
    }

    openGitHubPage(){
        electron.shell.openExternal('https://github.com/git-yuritancredi');
    }
}