import { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import axios from "axios";
import { Store } from '../Store';
import { toast } from 'react-toastify';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const userLogin ={username:username, password:password}
    try {
      const response = await axios.post("/user/login", userLogin);

      ctxDispatch({ type: 'USER_SIGNIN', payload: response.data.token });
      localStorage.setItem('userInfo', response.data.token);
      navigate("/items");
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.message)
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
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="userName">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" required  onChange={(e) => setUsername(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)}/>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
    </>
  );
}

export default Login;