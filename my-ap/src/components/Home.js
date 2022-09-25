import React,{useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import axios from 'axios'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link, useHistory} from 'react-router-dom';
import Pagination from './Pagination';

const Home=()=> {

  const [user, setUser] = useState({
    docType: '',
    query: ''
})
let history = useHistory()
const [data, setData]=useState('');
const [click,setClick]=useState(false);
const [cData,setCData]=useState('');
const [length,setLength]=useState(1);
const [currentPage, setCurrentPage] = useState(1);
let [articles, setArticles]=useState([]);
  const {docType, query}=user;

  const onChange = e => {setUser({ ...user, [e.target.name]: e.target.value })
console.log(e.target.value)
}

const sendReq=async()=>{
  try {
  console.log(query,docType)
  const res = await axios.get(`http://127.0.0.1:8000/litlookup/?kw_search=${query}&subtype=${docType}`)
  console.log(res.data,"hi")
  setData(res.data)
  setArticles(res.data.articles)
  setLength(res.data.articles.length)
  localStorage.setItem('articles', JSON.stringify(res.data))

  
  } catch (error) {
    
  }
}

const indexOfLastPost = currentPage * 10;
const indexOfFirstPost = indexOfLastPost - 10;
articles=(articles.slice(indexOfFirstPost, indexOfLastPost));

// Change page
const paginate = pageNumber => {
  console.log(pageNumber)
  setCurrentPage(pageNumber);
}


const settings=(article)=>{
  console.log(article)
localStorage.setItem('article',JSON.stringify(article.fields))
if(localStorage.getItem('article'))
history.push('/Article');
}

// useEffect(() => {
//   if(click){
//     history.pushState(data,'','/Article');
//   }
// }, [])


useEffect(()=>{
if(localStorage.getItem('articles'))
{
  setData(JSON.parse(localStorage.getItem('articles')))
  let art=JSON.parse(localStorage.getItem('articles'))
  setArticles(art.articles);
}
sendReq();
},[])

  return (
    <div className='container'>
      <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Cyber Literature Databases</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <select class="form-select" aria-label="Default select example" name="docType" onChange={onChange} value={docType} >
  <option selected>Select the document type</option>
  <option value=" ">All</option>
  <option value="Article">Article</option>
  <option value="Book">Book</option>
  <option value="Book+Chapter">Book Chapter</option>
  <option value="Conference+Paper">Conference Paper</option>
  <option value="Conference+Review">Conference Review</option>
  <option value="Data+Paper">Data Paper</option>
  <option value="Editorial">Editorial</option>
  <option value="Erratum">Erratum</option>
  <option value="Letter">Letter</option>
  <option value="Note">Note</option>
  <option value="Retracted">Retracted</option>
  <option value="Review">Review</option>
  <option value="Short+Survey">Short Survey</option>
</select>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search Keyphrase"
              className="me-2"
              aria-label="Search"
              id="hello"
              value={query}
              name="query"
              onChange={onChange}
            />
            <Button variant="outline-warning" onClick={sendReq}>Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
   <br></br>
   
<div class="row ">
    <Card style={{ width: '18rem' }} class="col-xs-6 col-md-3">
      <Card.Body class="bg-dark">
        <br></br>
        <Card.Title class="text-warning font-weight-bold lead">Respository Status</Card.Title>
        <hr color='white' />
        <br></br>
        {data?(<Card.Text class="text-white lead">
          
          <p><b>Number of articles: </b> {data.num_articles}</p>
          <p><b>Publication Sources:</b> {data.num_sources}</p>
          <p><b>Last Updated:</b> {data.last_updated} </p>

        </Card.Text>):(<Card.Text class="text-white lead">
          
          <p><b>Number of articles: </b> 15065</p>
          <p><b>Publication Sources:</b> 4540</p>
          <p><b>Last Updated:</b> April 19, 2022 </p>

        </Card.Text>)}
      </Card.Body>
    </Card>
    <div class="col-xs-6 col-md-8" >
    {data&&<div>
      <b>{data.articles.length} documents found {query? <span>for query- <i>{query}</i>  {docType!==' '?<span> under the document type <i>{docType}</i></span>: 'All'}</span>: ''}</b>
      </div>
      }
      {data&&(articles.map(article=>(<a  onClick={()=>{settings(article)}}>
        <Card  style={{ width: '50rem' }} o>
      <Card.Body style={{padding:'2rem'}} class="bg-dark">
        <Card.Title class="text-warning font-weight-bold lead">{article.fields.title}</Card.Title>
        <br></br>
        <Card.Subtitle className="mb-2 text-white">Publication: {article.fields.publicationName}</Card.Subtitle>
        <div style={{lineHeight:'2.5ex', height:'10ex', overflow:'hidden'}}>
        <Card.Text class="text-white">
          {article.fields.description}
        </Card.Text>
        </div>
      </Card.Body>
    </Card>
    <br></br>
        </a>)
        ))}
    </div>
    </div>
    <Pagination 
      postsPerPage={10}
      totalPosts={data? data.articles.length:100}
      paginate={paginate}
      />
    </div>
  )
}

export default Home;