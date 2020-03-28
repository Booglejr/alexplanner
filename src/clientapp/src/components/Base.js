import React from 'react';
import NavMenu from './NavMenu.js';
import Editor from './Editor.js';
import Footer from './Footer.js';  
import axios from 'axios';

class Base extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          isLoggedIn: true,
          shouldSync: false,
          serverRunning: false,
        }
        this.syncCallback = this.syncCallback.bind(this);
        this.toggleRunCallback = this.toggleRunCallback.bind(this);
    }
    
    syncCallback(){
      var shouldSync = this.state.shouldSync ? false : true;
      this.setState({shouldSync: shouldSync});
    }


    componentDidMount(){
      //Attempt fetch of contents.
      /*setInterval(axios.get('/running')
          .then(res => {
              if (res.data == true){
                this.setState({serverRunning: true});
              }else{
                this.setState({serverRunning: false});
              }
      }).catch((error) => {
        this.setState({serverRunning: false});
      }), 2000);*/
      /*'Content-Type': 'application/json', 'Cache-Control': 'no-cache'*/
  }


    toggleRunCallback(){
      this.setState({serverRunning: true});
      /*axios.post('/running')
          .then(res => {
              if (res.data == true){
                this.setState({serverRunning: false});
              }else{
                this.setState({serverRunning: true});
              }
            }
          ).catch((error) => {
            this.setState({serverRunning: false});
          })*/
    }

    render() {
      return (<div><NavMenu syncCallback={this.syncCallback} Running={this.state.serverRunning} toggleRunCallback={this.toggleRunCallback}/><Editor syncCallback={this.syncCallback} shouldSync={this.state.shouldSync}/><Footer/></div>);
    }
  }

  export default Base;