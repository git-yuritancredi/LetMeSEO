import React from "react";
import { Box } from "@mui/material";
import Robots from './Boxes/Robots';
import Canonical from './Boxes/Canonical';
import Viewport from './Boxes/Viewport';
import Title from './Boxes/Title';
import Description from './Boxes/Description';
import Keywords from './Boxes/Keywords';
import Headers from './Boxes/Headers';
import Images from "./Boxes/Images";
import OgTags from "./Boxes/OgTags";
import Facebook from "./Boxes/Facebook";
import Twitter from "./Boxes/Twitter";

export default class Analysis extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    render() {
        return (
            <Box className="analysis-conainer-inner">
                <Robots robots={this.state.data.robots} />
                <Canonical canonical={this.state.data.canonical} />
                <Viewport mobile={this.state.data.mobile} />
                <Title title={this.state.data.meta.title} />
                <Description description={this.state.data.meta.description} />
                <Keywords keywords={this.state.data.meta.keywords} />
                <Headers titles={this.state.data.titles} />
                <Images images={this.state.data.imageNoAlt} />
                <OgTags social={this.state.data.social} />
                <Facebook social={this.state.data.social} />
                <Twitter social={this.state.data.social} />
            </Box>
        );
    }
}
