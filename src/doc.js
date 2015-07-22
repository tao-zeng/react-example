/*@MODULE_GENERATOR@*/
/*Wed, 22 Jul 2015 10:17:41 GMT*/
let React = require('react'),
    {Navbar, Nav, NavItem, DropdownButton, MenuItem} = require('react-bootstrap'),
    rui = require('react-ui'),
    doc = {
    
        LayoutDocDemo : require('./layout/doc/demo'),
    
        WorkbenchDocDoc : require('./workbench/doc/doc')
    
    };
React.render(<Navbar brand='React UI'>
    <Nav>
      <NavItem eventKey={1} href='#'>Link</NavItem>
      <NavItem eventKey={2} href='#'>Link</NavItem>
      <DropdownButton eventKey={3} title='Dropdown'>
        <MenuItem eventKey='1'>Action</MenuItem>
        <MenuItem eventKey='2'>Another action</MenuItem>
        <MenuItem eventKey='3'>Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey='4'>Separated link</MenuItem>
      </DropdownButton>
    </Nav>
  </Navbar>, document.body);
modules.exports = doc;
