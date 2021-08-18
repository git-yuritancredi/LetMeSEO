import {Badge, Box, Divider, Typography} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import {i18n} from '../../language';

export default class Description extends React.Component
{
    validDescription(){
        if(!this.props.description){
            return 0;
        }
        if(this.props.description.length < 120){
            return 1;
        }
        if(this.props.description.length > 158) {
            return 2;
        }
        return 3;
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    {
                        this.validDescription() === 3 ?
                            <CheckCircleIcon color="primary" /> :
                            (
                                this.validDescription() === 1 || this.validDescription() === 2 ?
                                    <WarningIcon color="secondary" /> :
                                    <ErrorIcon color="error"  />
                            )
                    } {i18n.__("Description")}
                    {
                        this.validDescription() === 3 ?
                            <Badge badgeContent="+1" color="primary" /> :
                            (
                                this.validDescription() === 1 || this.validDescription() === 2 ?
                                    <Badge badgeContent="0" color="secondary" /> :
                                    <Badge badgeContent="-1" color="error" />
                            )
                    }
                </Typography>
                <Divider variant="fullWidth" />
                {
                    this.props.description ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.props.description}</Typography></Box> : ""
                }
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    {
                        this.validDescription() === 3 ? i18n.__("The meta description tag is correct.") : (
                            this.validDescription() === 1 ?
                                i18n.__("The meta description tag is too short, try to keep your meta description between 120 and 158 characters.") :
                                (this.validDescription() === 2 ?
                                    i18n.__("The meta description tag is too long, try to keep your meta description between 120 and 158 characters.") :
                                    i18n.__("The meta description was not found, it serves the function of advertising copy and thus is a very visible and important part of search marketing.")
                                )
                        )
                    }
                </Typography>
            </Box>
        );
    }
}
