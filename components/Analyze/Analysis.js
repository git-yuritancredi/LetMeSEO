import React from "react";
import { Typography, Divider, Box } from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';

export default class Analysis extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    validTitle(){
        if(!this.state.data.meta.title){
            return 0;
        }
        if(this.state.data.meta.title.length > 60){
            return 1;
        }
        return 2;
    }

    render() {
        return (
            <Box className="analysis-conainer-inner">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    {
                        this.validTitle() === 2 ?
                            <CheckCircleIcon color="primary" fontSize="default"/> :
                            (
                                this.validTitle() === 1 ?
                                    <WarningIcon color="secondary" fontSize="default"/> :
                                    <ErrorIcon color="disabled" fontSize="default"/>
                            )
                    } Title
                </Typography>
                <Divider variant="fullWidth" />
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    {
                        this.validTitle() === 2 ? "" : ""
                    }
                </Typography>
            </Box>
        );
    }
}