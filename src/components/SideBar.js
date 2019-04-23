import React from "react";

import logo from '../logo.svg';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components


const Sidebar = ({ ...props }) => {

  const brand = (
    <div className="header">
      <a
        href="#"
        className=""
      >
        <div className="logo">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        StoryPoints
      </a>
    </div>
  );
  
  return (
    <div className="sidebar">
      {brand}
      <Hidden implementation="css">
        <Drawer
          variant="temporary"
          // anchor={props.rtlActive ? "left" : "right"}
          // open={props.open}
          // classes={{
          //   paper: classNames(classes.drawerPaper, {
          //     [classes.drawerPaperRTL]: props.rtlActive
          //   })
          // }}
          // onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >

        
          
          <div className="">
          
          </div>
          
        </Drawer>
      </Hidden>
      <div className="sidebar__bg"></div>
    </div>
  );
};

export default Sidebar;
