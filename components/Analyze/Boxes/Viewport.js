import {Badge, Box, Divider, Typography} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";

export default class Viewport extends React.Component
{
    validViewport(){
        if(this.props.mobile) {
            if (this.props.mobile.indexOf('width=device-width') !== -1 && this.props.mobile.indexOf('initial-scale=1') !== -1) {
                return true;
            }
        }
        return false;
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    {
                        this.validViewport() ? <CheckCircleIcon color="primary" /> : <ErrorIcon color="error" />
                    } Viewport
                    {
                        this.validViewport() ? <Badge badgeContent="+0.5" color="primary" /> : <Badge badgeContent="0" color="secondary" />
                    }
                </Typography>
                <Divider variant="fullWidth" />
                {
                    this.props.mobile ? <Box className="content-tag"><Typography variant="body2" color="primary">{this.props.mobile}</Typography></Box> : ""
                }
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    About 48% of people will use a mobile search to find information about a product or business. This means you need to focus attention on responsive and mobile designs.<br />
                    To inform search engines you have a responsive design available, you must use the meta viewport tag.
                </Typography>
            </Box>
        );
    }
}