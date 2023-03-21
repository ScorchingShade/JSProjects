import { useContext, useEffect, useReducer } from 'react';
import logger from 'use-reducer-logger';
import { useNavigate, useLocation } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import Product from '../components/Product';
import { Store } from '../Store';

function HomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const reducer= (state, action)=>{
    switch (action.type){
      case 'FETCH_REQUEST':
        return {...state, loading:true};
      case 'FETCH_SUCCESS':
        return {...state, products:action.payload, loading:false};
      case 'FETCH_FAIL':
        return {...state, loading:false, error:action.payload};
      default:
        return state;
    }
  }

  const [{loading, error, products}, dispatch] = useReducer(logger(reducer),{
    products:[],
    loading:true,
    error:''
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type:'FETCH_REQUEST'})
      try {
        const result = await axios.get('/item/list');
        dispatch({type:'FETCH_SUCCESS', payload:result.data})
      }
      catch(err){
        dispatch({type:'FETCH_FAIL', payload:err})
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <div>
      <Helmet>
        <title>Ankush Dukaan</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading?(<LoadingBox />):error?(<MessageBox>{error}</MessageBox>):
        (<Row>
          {products.map((product) => (
            <Col sm={6} md={4} lg={3} className="mb-3" key={product.id}>
          <Product product={product}/>
          </Col>
        ))}
        </Row>
        )
        }
      </div>
    </div>
  );
}
export default HomeScreen;