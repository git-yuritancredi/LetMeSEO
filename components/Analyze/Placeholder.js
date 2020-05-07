import React from 'react';
import { Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export default class Placeholder extends React.Component
{
    constructor(props) {
        super(props);

        let items = [];
        for(let i = 40; i > 0; i--){
            items.push(<Skeleton className="code-line" animation={props.animation} key={i} variant="rect" width={this.getRandom()} height={15} />);
        }

        this.state = {
            skeletonItems: items
        }
    }

    getRandom(){
        let random = Math.random(0, 100).toFixed(2) * 100;
        random < 1 ? random+10 : random;
        return random+"%";
    }

    render() {
        return (
            <Box className="skeleton-container">
                {this.state.skeletonItems}
            </Box>
        );
    }
}