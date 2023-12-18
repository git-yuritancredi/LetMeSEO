import React from "react";
import {i18n} from '../../language';
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {Badge, Box, Divider, Typography} from "@mui/material";

export default class Headers extends React.Component {
    headerTagIcon() {
        if (this.props.titles.h1 > 1 || this.props.titles.h1 === 0) {
            return <ErrorIcon color="error"/>;
        }
        if ((this.props.titles.h2 > this.props.titles.h3) && this.props.titles.h3 > 0) {
            return <WarningIcon color="secondary"/>;
        }
        if ((this.props.titles.h3 > this.props.titles.h4) && this.props.titles.h4 > 0) {
            return <WarningIcon color="secondary"/>;
        }
        return <CheckCircleIcon color="primary"/>;
    }

    headerAdditionalText() {
        if (this.props.titles.h1 === 0) {
            return i18n.__("In this case your site hasn't H1 tag and this is not correct for search engines.");
        }
        if (this.props.titles.h1 > 1) {
            return i18n.__("In this case your site has more than one H1 tag and this is not correct for search engines.");
        }
        if ((this.props.titles.h2 > this.props.titles.h3) && this.props.titles.h3 > 0) {
            return i18n.__("In this case your site can reduce the content importance moving some H2 to H3 tags that has minor importance than H2 tag.");
        }
        if ((this.props.titles.h3 > this.props.titles.h4) && this.props.titles.h4 > 0) {
            return i18n.__("In this case your site can reduce the content importance moving some H3 to H4 tags that has minor importance than H3 tag.");
        }
        return "";
    }

    headerTagStatus() {
        if (this.props.titles.h1 > 1 || this.props.titles.h1 === 0) {
            return 0;
        }
        if (
            ((this.props.titles.h2 > this.props.titles.h3) && this.props.titles.h3 > 0) ||
            ((this.props.titles.h3 > this.props.titles.h4) && this.props.titles.h4 > 0)
        ) {
            return 1;
        }
        return 2;
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    {this.headerTagIcon()} {i18n.__("Header tags")}
                    {
                        this.headerTagStatus() === 0 ? <Badge badgeContent="-0.5" color="error"/> : (
                            this.headerTagStatus() === 1 ? <Badge badgeContent="0" color="secondary"/> :
                                <Badge badgeContent="+0.5" color="primary"/>
                        )
                    }
                </Typography>
                <Divider variant="fullWidth"/>
                {
                    <Box className="content-tag">
                        <Typography variant="body2" color="primary">
                            {i18n.__("Number of H1:")} {this.props.titles.h1} <br/>
                            {i18n.__("Number of H2:")} {this.props.titles.h2} <br/>
                            {i18n.__("Number of H3:")} {this.props.titles.h3} <br/>
                            {i18n.__("Number of H4:")} {this.props.titles.h4}
                        </Typography>
                    </Box>
                }
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    {i18n.__("Header tags are an important on-page SEO factor because they’re used to communicate to the search engines what your website is about.")}
                    <br/>
                    {i18n.__("Search engines recognize the copy in your header tags as more important than the rest.")}
                    {this.headerAdditionalText() !== "" ? <br/> : ''}
                    {this.headerAdditionalText()}
                </Typography>
            </Box>
        );
    }
}
