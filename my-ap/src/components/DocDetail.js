import React,{useState,useEffect} from 'react'
import axios from 'axios';
import CLDNavBar from "./styledComponents/CLDNavBar";
import {CLDDetailContainer, CLDDetailPage} from "./styledComponents/CLDDetail";
import {useParams} from "react-router";

export default function DocDetail(props) {
    const {query, docType} = useParams();
    const [article,setArticle] = useState();

    const getCountry = () => {
        if(localStorage.getItem('article')!=null){
            let ans= JSON.parse(localStorage.getItem('article'))
            let author_names=ans.author_names.split(';')
            ans.author_names=author_names;
            setArticle(ans);
        }


    }

    useState(()=>{
        getCountry()
    })

    return (
        <div>
            <CLDNavBar 
                query={query}
                docType={docType}
            />
            <div>
                {article != null ? <div>
                    {article && (<CLDDetailPage className="jumbotron">
                        <div className="container">
                            <h1 className="display-4">{article.title}</h1>
                            <p className="lead">
                                <p><b>Authored by: </b> {article.author_names.map(n => (
                                    <span>{n}</span>
                                ))}</p>
                            </p>
                            {article.authkeywords && <p className="lead">
                                <p><b>Author Keywords: </b>{article.authkeywords}</p>
                            </p>}

                            <h3>{article.publicationName}</h3>
                            <hr className="my-4"/>
                            <p>{article.description}</p>
                            <h5>Cited by: {article.citedby_count}</h5>
                        </div>
                    </CLDDetailPage>)}
                </div> : 'hello'}
            </div>
        </div>
    )
}
