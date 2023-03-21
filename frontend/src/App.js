import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./screens/LoginScreen";
import Signup from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import ErrorScreen from "./screens/ErrorScreen";
import CartScreen from './screens/CartScreen';
import ProductScreen from "./screens/ProductScreen";
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useContext } from 'react';
import { Store } from './Store';

const App = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
  };
  return (
    <Router>
      <div className="d-flex flex-column site-container">
      <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/items">
                <Navbar.Brand>Ankush Dukaan</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto w-100 justify-content-end">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {localStorage.getItem('cartItems')&&cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title="More" id="basic-nav-dropdown">
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/">
                    Sign In
                  </Link>
                )}
              </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main className="mt-3">
          <Container>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/items" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />}></Route>
              <Route path="*" element={<ErrorScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">Made quickly with care by Ankush Sharma!</div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
