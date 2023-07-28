import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const navItems = ['Home', 'Review', 'restaurant'];

const NavigationBar = () => {
    return (
        <Navbar bg='light' expand='lg'>
            <Container>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link href='/'>Home</Nav.Link>
                        <Nav.Link href='/revieweditor'>ReviewEditor</Nav.Link>
                        <Nav.Link href='/expenseeditor'>ExpenseEditor</Nav.Link>
                        {/* TODO(table display): add Nav.Link to table*/}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default NavigationBar;
