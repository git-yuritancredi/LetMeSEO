import React from 'react';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MinimizeIcon from '@mui/icons-material/Minimize';
    import electron from 'electron';

export default class UserToolbar extends React.Component
{
    closeHandler() {
        electron.ipcRenderer.send('quit-app');
    }

    resizeHandler(){
        electron.ipcRenderer.send('resize-app');
    }

    minimizeHandle(){
        electron.ipcRenderer.send('minimize-app');
    }

    render() {
        return (
            <AppBar elevation={0} className="toolbar" color="transparent" position="static">
                <Toolbar>
                    <IconButton onClick={this.closeHandler} edge="start" color="default" aria-label="menu">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={this.resizeHandler} edge="start" color="default" aria-label="menu">
                        <FullscreenIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={this.minimizeHandle} edge="start" color="default" aria-label="menu">
                        <MinimizeIcon fontSize="small" />
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}
