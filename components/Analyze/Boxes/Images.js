import React from "react";
import {i18n} from "../../language";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {Badge, Box, Divider, Typography} from "@mui/material";

export default class Images extends React.Component {
    imageAsString() {
        return this.props.images.map((image) => {
            return <>{image} <br/></>;
        });
    }

    render() {
        return (
            <Box className="tag-analysis-container">
                <Typography variant="h5" color="textPrimary" className="title-tag">
                    {this.props.images.length > 0 ? <WarningIcon color="secondary"/> :
                        <CheckCircleIcon color="primary"/>} {i18n.__("Images alt attribute")}
                    {this.props.images.length > 0 ? <Badge badgeContent="0" color="secondary"/> :
                        <Badge badgeContent="+0.5" color="primary"/>}
                </Typography>
                <Divider variant="fullWidth"/>
                {this.props.images.length > 0 ?
                    <Box className="content-tag no-wrapping">
                        <Typography variant="body2" color="primary">
                            {this.imageAsString()}
                        </Typography>
                    </Box> : ''
                }
                <Typography variant="subtitle1" className="description-tag" color="textSecondary">
                    {i18n.__("Alt attribute provide a text alternative for search engines.")} <br/>
                    {i18n.__("Applying images to alt attribute such as product photos can positively impact an ecommerce store's search engine rankings.")}
                </Typography>
            </Box>
        );
    }
}
