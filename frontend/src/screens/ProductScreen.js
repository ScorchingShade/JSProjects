import axios from 'axios';
import { useEffect, useReducer, useContext } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
import { useNavigate,useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';

function ProductScreen() {
  const params = useParams();
  const { slug } = params;
  const navigate = useNavigate();

  const token = localStorage.getItem("userInfo");
  const config = {
    headers: { Authorization: `Bearer ${token}` }
};

// Reducer to handle complex fetch state
  const reducer= (state, action)=>{
    switch (action.type){
      case 'FETCH_REQUEST':
        return {...state, loading:true};
      case 'FETCH_SUCCESS':
        return {...state, product:action.payload, loading:false};
      case 'FETCH_FAIL':
        return {...state, loading:false, error:action.payload};
      default:
        return state;
    }
  }


  const [{loading, error, product}, dispatch] = useReducer((reducer),{
    product:[],
    loading:true,
    error:''
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type:'FETCH_REQUEST'})
      try {
        const result = await axios.get(`/item/list/${slug}`);

        dispatch({type:'FETCH_SUCCESS', payload:result.data})
      }
      catch(err){
        dispatch({type:'FETCH_FAIL', payload:err})
      }
    };
    fetchData();
  }, [slug]);


  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {cart}=state;


  /**
   * Handle adding to cart
   * @date 2023-03-21
   * @returns {any}
   */
  const addToCartHandler = async() => {
    const existItem=cart.cartItems.find((x)=>x.id===product.id)
    const quantity=existItem?existItem.quantity+1:1;
    try {
      const body= {item_id:product.id}
      const result = await axios.post('/cart/add',body,config);
      if(result){
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload: { ...product, quantity },
        });
        navigate('/cart');
      }
    }
    catch(err){
      dispatch({type:'FETCH_FAIL', payload:err.message})
    }
    
  };

  return loading?(
    <LoadingBox />
  ):error?(<MessageBox variant="danger">{error}</MessageBox>):(
    <div>

      <Row>
        <Col md={6}>
          <img className="img-large" src={product.url} alt={product.name}></img>
        </Col>
        <Col md={3}>
        <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in leo mattis ante dignissim accumsan ultrices a metus. Fusce sed viverra felis, sed accumsan tellus. Nulla feugiat cursus ornare. Vestibulum eleifend, tellus vitae viverra tincidunt, lacus felis vulputate augue, non vestibulum lacus nunc vel nisl</p>
            </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={3}>

        <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>₹{product.price}</Col>
                  </Row>
                </ListGroup.Item>
                
                  <ListGroup.Item>
                    <div className="d-grid">
                    <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
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
export default ProductScreen;