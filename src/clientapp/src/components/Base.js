import React from 'react';
import NavMenu from './NavMenu.js';
import Editor from './Editor.js';
import Footer from './Footer.js';  

class Base extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          isLoggedIn: true,
          shouldSync: false
        }
        this.syncCallback = this.syncCallback.bind(this);
    }
    
    syncCallback(){
      var shouldSync = this.state.shouldSync ? false : true;
      this.setState({shouldSync: shouldSync});
    }

    render() {
      return (<div><NavMenu syncCallback={this.syncCallback}/><Editor syncCallback={this.syncCallback} shouldSync={this.state.shouldSync}/><Footer/></div>);
    }
  }

  export default Base;