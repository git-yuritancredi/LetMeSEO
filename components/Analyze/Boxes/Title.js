import {Badge, Box, Divider, Typography} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";

export default class Title extends React.Component
{
    validTitle(){
        if(!this.props.title){
            return 0;
        }
        if(this.props.title.length > 60){
            return 1;
        }
        return 2;
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    {
                        this.validTitle() === 2 ?
                            <CheckCircleIcon color="primary" /> :
                            (
                                this.validTitle() === 1 ?
                                    <WarningIcon color="secondary" /> :
                                    <ErrorIcon color="disabled" />
                            )
                    } Title
                    {
                        this.validTitle() === 2 ?
                            <Badge badgeContent="+1" color="primary" /> :
                            (
                                this.validTitle() === 1 ?
                                    <Badge badgeContent="0" color="secondary" /> :
                                    <Badge badgeContent="-1" color="error" />
                            )
                    }
                </Typography>
                <Divider variant="fullWidth" />
                {
                    this.props.title ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.props.title}</Typography></Box> : ""
                }
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    {
                        this.validTitle() === 2 ? "The meta title tag is correct." : (
                            this.validTitle() === 1 ?
                                "The meta title tag is greater than 60 characters, some search engines such as Google show only 55/60 characters." :
                                "The meta title tag was not found, is very important to implement it in your site because it is how searches see your page in search engines such as Google."
                        )
                    }
                </Typography>
            </Box>
        );
    }
}