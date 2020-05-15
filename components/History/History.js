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
    FormControl
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import DeleteIcon from '@material-ui/icons/Delete';
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import BackspaceIcon from '@material-ui/icons/Backspace';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

export default class History extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            analyzedSites: 0,
            confirmOpened: false,
            data: props.data,
            originalData: [],
            searchString: "",
            itemsPerPage: 20,
            openedRows: [],
            currentPage: 0,
            setAnalysisData: props.keepDataHandler,
            headCells: [
                { id: 'site', numeric: false, disablePadding: true, label: 'Site URL' },
                { id: 'point', numeric: true, disablePadding: false, label: 'LetMeScore' },
                { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
            ]
        };

        electron.ipcRenderer.on('history-update', (event, data) => {
            this.setState({
                data: data
            });
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
        this.state.setAnalysisData('analyze', row);
    }

    searchHandler(e){
        let searchString = e.target.value;
        let toMap = this.state.data;
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
                    if(operator === "eq") {
                        return item.analysisPoints === value;
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
                            <Typography variant="h3" color="textPrimary">History</Typography>
                            <Typography variant="subtitle1" color="textSecondary">You currently has analyzed {this.state.analyzedSites} sites</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" size="large" onClick={this.confirmHandle.bind(this)} fullWidth disableElevation>CLEAR HISTORY</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Grid className="container" container>
                    <Grid item xs={12}>
                        <FormControl size="small" fullWidth variant="outlined">
                            <InputLabel htmlFor="standard-basic">Search...</InputLabel>
                            <OutlinedInput
                                id="standard-basic"
                                label="Search..."
                                onChange={this.searchHandler.bind(this)}
                                variant="outlined"
                                value={this.state.searchString}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Clear search"
                                            onClick={this.state.searchString ? this.clearSearchHandle.bind(this) : this.infoHandler.bind(this)}
                                        >
                                            {this.state.searchString ? <BackspaceIcon/> : <HelpOutlineIcon />}
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
                                    {this.state.data.length ?
                                        this.state.data.slice((this.state.currentPage * this.state.itemsPerPage), ((this.state.currentPage+1) * this.state.itemsPerPage))
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
                                                    History is empty
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
                            count={this.state.data.length}
                            rowsPerPage={this.state.itemsPerPage}
                            page={this.state.currentPage}
                            onChangePage={this.pageHandler.bind(this)}
                            onChangeRowsPerPage={this.paginationHandler.bind(this)}
                        />
                    </Grid>
                </Grid>
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
                        <Button onClick={this.proceedClean.bind(this)} variant="outlined" className="danger-btn" autoFocus>
                            PROCEED
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
}