import React,{useState,useEffect} from 'react'
import axios from 'axios';

export default function Article(props) {
console.log(localStorage.getItem('article'));

const [article,setArticle]=useState();

const getCountry=()=>{
  console.log(localStorage.getItem('article'))
  if(localStorage.getItem('article')!=null){
    let ans= JSON.parse(localStorage.getItem('article'))
    let author_names=ans.author_names.split(';')
    ans.author_names=author_names;
     setArticle(ans);
  }
    

}

useEffect(()=>{
   getCountry()
})

  return (
    <div>
    {article!=null?<div>
        {article&&(<div class="jumbotron">
  <h1 class="display-4">{article.title}</h1>
  <p class="lead">
  <p><b>Authored by: </b> {article.author_names.map(n=>(
    <span>{n}</span>
  ))}</p>
  </p>
  {article.authkeywords&&<p class="lead">
  <p><b>Author Keywords: </b>{article.authkeywords}</p>
  </p>}

  <h3>{article.publicationName}</h3>
  <hr class="my-4" />
  <p>{article.description}</p>
  <h5>Cited by: {article.citedby_count}</h5>
</div>)}
    </div>:'hello'}
    </div>
  )
}
