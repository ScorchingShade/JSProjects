import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

function Product({ product }) {

  const token = localStorage.getItem("userInfo");

  const config = {
    headers: { Authorization: `Bearer ${token}` }
};
const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    try {
      const body= {item_id:item.id}
      const result = await axios.post('/cart/add',body,config);
      if(result){
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...product, quantity },
        });
        
      }
    }
    catch(err){
      navigate('/*');
    }
  };



  return (
    <Card>
      <Link
        to={`/product/${product.id}`}
      >
        <img src={product.url} alt={product.name} className="card-img-top card-image-fit" />
      </Link>
      <Card.Body>
        <Link
          to={`/product/${product.id}`}
        >
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Card.Text>₹{product.price}</Card.Text>
        <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}

export default Product;
