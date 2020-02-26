import React from 'react';
import {Navbar, Button, NavbarBrand, NavbarToggler, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarText, Collapse, Nav } from 'reactstrap';

class NavMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false
        }

        this.syncCallback = this.props.syncCallback;
    }

    toggle(){
        //this.setState({isOpen: this.state.isOpen ? false : true});
    }

    render() {
        return (
            <Navbar color="dark" dark expand="md">
                <NavbarBrand>AlexBox</NavbarBrand>
                <NavbarToggler onClick={this.toggle}/>
                <Collapse isOpen={true} navbar>
                <NavbarText>Admin Console</NavbarText>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Button onClick={this.syncCallback} color="info">Sync</Button>
                    </NavItem>
                </Nav>
                </Collapse>
            </Navbar>
        );
    }
  }

  export default NavMenu;