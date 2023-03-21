import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const handleSignup = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/user/create', { name, username, password });

      // clear input fields
      setName('');
      setUsername('');
      setPassword('');

      ctxDispatch({ type: 'USER_SIGNIN', payload: response.data.token });
      localStorage.setItem('userInfo', response.data.token);
      // redirect to list items page on successful login
      navigate('/items');
    } catch (error) {
      console.error("here is error",error);
      toast.error(error.response.data)
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/items");
    }
  }, [navigate, userInfo]);

  return (
    <>

<Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={handleSignup}>

      <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="name">
        <Form.Label>Username</Form.Label>
          <Form.Control type="text" required  onChange={(e) => setUsername(e.target.value)}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
          <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)}/>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
    </>
  );
};

export default Signup;