import { useContext, useEffect } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const navigate = useNavigate();
  const {
    cart: { cartItems },
  } = state;

  const token = localStorage.getItem("userInfo");
  const config = {
    headers: { Authorization: `Bearer ${token}` }
};


const updateCartHandler = async (item,quantity) => {
  try {
    const body= {item_id:item.id}
    if(quantity>=0){
      const result = await axios.post('/cart/add',body,config);
      if(result){
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity },
        });
        
      }
      if(quantity===0){
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
      }
    }
  }
  catch(err){
    navigate('/*');
  }
};


const removeItemHandler = async (item) => {
  const body= {item_id:item.id}
    const result = await axios.post('/cart/delete',body,config);

    if(result){
      ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    }
};

const removeItem = async (item, quantity)=>{
  try {
    const body= {item_id:item.id}
    if(quantity>=0){
      const result = await axios.post('/cart/delete',body,config);
      if(result){
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...item, quantity },
        });
        
      }
      if(quantity===0){
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
      }
    }
  }
  catch(err){
    navigate('/*');
  }
}


const checkOutHandler=async()=>{
  try{
    const result = await axios.post('/cart/list',{},config);
    console.log(result)
    const cartId=result.data.cart.id;
    const order = await axios.post(`/cart/${cartId}/complete`,{},config);
    console.log(order)
    if(order){
      toast.success("Order completed! Check your completed orders in Order History!")
      ctxDispatch({ type: 'CART_REMOVE_ALL'});
      navigate('/items');
    }
  }
  catch(err){
    console.log(err)
    toast.error("Something went wrong: ")
  }

}

useEffect(() => {
  if (!userInfo) {
    navigate("/");
  }
}, [navigate, userInfo]);


  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/items">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.url}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button variant="light" onClick={() =>
                          removeItem(item,  item.quantity - 1)
                        }>
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>₹{item.price}</Col>
                    <Col md={2}>
                      <Button variant="light" onClick={() => removeItemHandler(item)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : ₹
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      disabled={cartItems.length === 0}
                      onClick={checkOutHandler}
                    >
                      Checkout and Order
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
