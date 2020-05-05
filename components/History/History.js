import React from "react";
import {Box, Button, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@material-ui/core";

export default class History extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            analyzedSites: 0,
            confirmOpened: false
        };
    }

    confirmHandle(){
        this.setState({
            confirmOpened: true
        });
    }

    closeHandle(){
        this.setState({
            confirmOpened: false
        });
    }

    render() {
        return (
            <>
                <Box className="heading">
                    <Grid alignItems="center" container>
                        <Grid item xs={9}>
                            <Typography variant="h3" color="textPrimary">History</Typography>
                            <Typography variant="subtitle1" color="textSecondary">You currently has analyzed {this.state.analyzedSites} sites</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" size="large" onClick={this.confirmHandle.bind(this)} fullWidth disableElevation>CLEAR HISTORY</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Dialog
                    open={this.state.confirmOpened}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Are you shure to delete all history?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            If you proceed you lost all data and analysis of the LetMeScore, the option is irreversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeHandle.bind(this)} variant="outlined" color="default">
                            CANCEL
                        </Button>
                        <Button onClick={this.closeHandle.bind(this)} variant="outlined" className="danger-btn" autoFocus>
                            PROCEED
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}