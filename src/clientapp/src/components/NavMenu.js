import React from 'react';
import {Navbar, Button, NavbarBrand, NavbarToggler, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarText, Collapse, Nav } from 'reactstrap';

class NavMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
        }

        this.syncCallback = this.props.syncCallback;
        this.toggleRunCallback = this.props.toggleRunCallback;
    }

    toggle(){
        //this.setState({isOpen: this.state.isOpen ? false : true});
    }

    render() {
        if(this.props.Running == true){
            var running1 = "Running";
            var running2 = "running";
        }else{
            var running1 = "Stopped";
            var running2 = "stopped";
        }
        return (
            <Navbar color="dark" dark expand="md">
                <NavbarBrand><img className="image" src="infowars.png"/>AlexBox</NavbarBrand>
                <NavbarToggler onClick={this.toggle}/>
                <Collapse isOpen={true} navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Button onClick={this.syncCallback} color="info">Save</Button>&ensp;
                        <Button onClick={this.toggleRunCallback} color="secondary" disabled>Doesn't Work {/*running1*/ /*<span className={"circle "+running2}></span>*/}</Button>
                    </NavItem>
                </Nav>
                </Collapse>
            </Navbar>
        );
    }
  }

  export default NavMenu;