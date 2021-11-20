import React from "react";
import electron from "electron";
import {
    Box,
    Button,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableHead,
    TableRow,
    IconButton,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    OutlinedInput,
    InputLabel,
    FormControl,
    List,
    ListItem,
    ListItemText,
    Divider
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import DeleteIcon from '@material-ui/icons/Delete';
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import BackspaceIcon from '@material-ui/icons/Backspace';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CloseIcon from '@material-ui/icons/Close';
import {connect} from 'react-redux';
import {i18n} from "../language";
import {setHistory} from "../slices/historySlice";
import {setStoredAnalysis} from '../slices/appSlice';
import {mapState} from "../store";

class History extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            confirmOpened: false,
            infoOpened: false,
            originalData: [],
            searchString: "",
            itemsPerPage: 20,
            openedRows: [],
            currentPage: 0,
            headCells: [
                { id: 'site', numeric: false, disablePadding: true, label: i18n.__('Site URL') },
                { id: 'point', numeric: true, disablePadding: false, label: i18n.__('LetMeScore') },
                { id: 'actions', numeric: false, disablePadding: false, label: i18n.__('Actions') },
            ]
        };

        electron.ipcRenderer.on('history-update', (event, data) => {
            this.props.dispatch(setHistory(data));
        });
    }

    confirmHandle(){
        this.setState({
            confirmOpened: true
        });
    }

    proceedClean(){
        electron.ipcRenderer.send('clean-history');
        this.closeHandle();
    }

    closeHandle(){
        this.setState({
            confirmOpened: false
        });
    }

    pageHandler(e, newPage){
        this.setState({
            currentPage: newPage
        });
    }

    paginationHandler(e){
        this.setState({
            itemsPerPage: e.target.value
        })
    }

    deleteItem(key){
        electron.ipcRenderer.send('delete-history', {key: key});
    }

    doAnalysis(row){
        this.props.dispatch(setStoredAnalysis(row))
    }

    searchHandler(e){
        let searchString = e.target.value;
        let toMap = this.props.history.items;
        let mapped = [];
        if(this.state.originalData.length > 0){
            toMap = this.state.originalData;
        }

        if(searchString.indexOf('points:') > -1){
            let operator = searchString.split(':');
            operator = operator[1];
            let value = operator.split('=');
            operator = value[0];
            let valueBtw = parseFloat(value[2]);
            value = parseFloat(value[1]);

            if(!isNaN(value)){
                mapped = toMap.filter((item) => {
                    if (operator === "eq") {
                        return value === 0 ? item.analysisPoints <= value : item.analysisPoints === value;
                    }else if(operator === "neq"){
                        return item.analysisPoints !== value;
                    }else if(operator === "gt"){
                        return item.analysisPoints > value;
                    }else if(operator === "gte"){
                        return item.analysisPoints >= value;
                    }else if(operator === "lt"){
                        return item.analysisPoints < value;
                    }else if(operator === "lte"){
                        return item.analysisPoints <= value;
                    }else if(operator === "btw" && !isNaN(valueBtw)){
                        return item.analysisPoints >= value && item.analysisPoints <= valueBtw;
                    }
                });
            }
        }else{
            mapped = toMap.filter((item) => {
                return item.analyzedUrl.indexOf(searchString) > -1;
            });
        }
        this.setState((previousState) => ({
            data: mapped,
            searchString: searchString,
            originalData: previousState.originalData.length === 0 ? previousState.data : previousState.originalData
        }));
    }

    infoHandler(){
        this.setState({
            infoOpened: true
        });
    }

    closeInfoHandler(){
        this.setState({
            infoOpened: false
        });
    }

    clearSearchHandle(){
        this.setState((previousState) => ({
            data: previousState.originalData,
            searchString: ""
        }));
    }

    render() {
        return (
            <Box className="content-container">
                <Box className="heading">
                    <Grid alignItems="center" container>
                        <Grid item xs={9}>
                            <Typography variant="h3" color="textPrimary">{i18n.__("History")}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">{i18n.__("You currently has analyzed %s sites", this.props.history.items.length)}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" size="large" onClick={this.confirmHandle.bind(this)} fullWidth disableElevation>{i18n.__("CLEAR HISTORY")}</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Grid className="container" container>
                    <Grid item xs={12}>
                        <FormControl size="small" fullWidth variant="outlined">
                            <InputLabel htmlFor="standard-basic">{i18n.__("Search...")}</InputLabel>
                            <OutlinedInput
                                id="standard-basic"
                                label={i18n.__("Search...")}
                                onChange={this.searchHandler.bind(this)}
                                variant="outlined"
                                value={this.state.searchString}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Clear search"
                                            onClick={this.state.searchString ? this.clearSearchHandle.bind(this) : this.infoHandler.bind(this)}
                                        >
                                            {this.state.searchString ? <BackspaceIcon/> : <HelpOutlineIcon onClick={this.infoHandler.bind(this)} />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid className="container histroy-container" container>
                    <Grid item xs={12}>
                        <TableContainer className="data-table scroll-inner">
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {this.state.headCells.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align="center"
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.props.history.items.length ?
                                        this.props.history.items.slice((this.state.currentPage * this.state.itemsPerPage), ((this.state.currentPage+1) * this.state.itemsPerPage))
                                            .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.analyzedUrl+"-row"}>
                                                <TableCell key={row.analyzedUrl} align="center">
                                                    {row.analyzedUrl}
                                                </TableCell>
                                                <TableCell key={row.analyzedUrl+"-"+row.analysisPoints} align="center">
                                                    <Rating
                                                        name="hover-feedback"
                                                        value={row.analysisPoints}
                                                        precision={0.5}
                                                        emptyIcon={<CheckCircleOutlineIcon color="disabled"/>}
                                                        icon={<CheckCircleIcon color="primary" />}
                                                        readOnly
                                                    />
                                                </TableCell>
                                                <TableCell key={row.analyzedUrl+"-actions"} align="center">
                                                    <IconButton onClick={() => { this.deleteItem(row.analyzedUrl) }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => { this.doAnalysis(row); }}>
                                                        <CallMissedOutgoingIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }) :
                                        <>
                                            <TableRow hover role="checkbox" tabIndex={-1} key="nodata-row">
                                                <TableCell colSpan={3} align="center">
                                                    {i18n.__("History is empty")}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[20, 25, 50]}
                            component="div"
                            labelRowsPerPage={i18n.__("Rows per page:")}
                            labelDisplayedRows={(data) => i18n.__("%s - %s of %s", data.from, data.to, data.count)}
                            count={this.props.history.items.length}
                            rowsPerPage={this.state.itemsPerPage}
                            page={this.state.currentPage}
                            onPageChange={this.pageHandler.bind(this)}
                            onChangeRowsPerPage={this.paginationHandler.bind(this)}
                        />
                    </Grid>
                </Grid>
                <Dialog
                    open={this.state.confirmOpened}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{i18n.__("Are you shure to delete all history?")}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {i18n.__("If you proceed you lost all data and analysis of the LetMeScore, the option is irreversible.")}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeHandle.bind(this)} variant="outlined" color="default">
                            {i18n.__("CANCEL")}
                        </Button>
                        <Button onClick={this.proceedClean.bind(this)} variant="outlined" className="danger-btn" autoFocus>
                            {i18n.__("PROCEED")}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    className="popup-info-search"
                    open={this.state.infoOpened}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle id="alert-dialog-title">
                        <IconButton edge="start" color="default" onClick={this.closeInfoHandler.bind(this)}>
                            <CloseIcon />
                        </IconButton>
                        {i18n.__("Search instructions")}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography variant="subtitle1" color="textPrimary">{i18n.__("Simple site search")}</Typography>
                            <Divider variant="fullWidth" />
                            <Typography variant="body2">{i18n.__("You just simply search site url in the bar.")}</Typography>
                            <br />
                            <Typography variant="subtitle1" color="textPrimary">{i18n.__("Advanced search")}</Typography>
                            <Divider variant="fullWidth" />
                            <Typography variant="body2">{i18n.__("You can search by LetMeScore using this syntax:")}</Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText>
                                        <code>points:eq=<strong>x</strong></code> {i18n.__("indicate that LetMeScore must be equal to value specified in x")}
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <code>points:gt=<strong>x</strong></code> {i18n.__("indicate that LetMeScore must be grater than value specified in x")}
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <code>points:gte=<strong>x</strong></code> {i18n.__("indicate that LetMeScore must be grater than equal to value specified in x")}
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <code>points:lt=<strong>x</strong></code> {i18n.__("indicate that LetMeScore must be lower than value specified in x")}
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <code>points:lte=<strong>x</strong></code> {i18n.__("indicate that LetMeScore must be lower than equal value specified in x")}
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <code>points:btw=<strong>x</strong>=<strong>y</strong></code> {i18n.__("indicate that LetMeScore must be between value specified in x and y")}
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeInfoHandler.bind(this)} autoFocus>
                            {i18n.__("OK")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
}

export default connect(mapState)(History);
