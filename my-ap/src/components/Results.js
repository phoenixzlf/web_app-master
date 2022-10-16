import Card from "react-bootstrap/Card";
import CLDPagination from "./styledComponents/CLDPagination";
import React, {useMemo, useState} from "react";
import {search_CLD} from "../utils/api";
import {useParams} from "react-router";
import {useNavigate, useLocation} from "react-router-dom";
import CLDNavBar from "./styledComponents/CLDNavBar";
import {CLDResultCard,
    CLDResultCardBody,
    CLDResultCardTitle,
    CLDResultCardText,
    CLDResultsListDiv} from './styledComponents/CLDResults'


function Result() {
    const navigate = useNavigate();
    const location = useLocation();
    const PageSize = 10
    const {query, docType} = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    // const [currentPageData, setCurrentPageData] = useState([]);
    const [data, setData] = useState('');
    let [articles, setArticles] = useState([]);

    React.useState(() => {
        search_CLD(query, docType).then(res => {
            setData(res.data)
            setArticles(res.data.articles)
            console.log("here")
            console.log(res.data.articles[50])
            localStorage.setItem('articles', JSON.stringify(res.data))
            // const indexOfLastPost = currentPage * 10;
            // const indexOfFirstPost = indexOfLastPost - 10;
            // setCurrentPageData(res.data.articles.slice(indexOfFirstPost, indexOfLastPost));
        })
    })

    React.useEffect(() => {
        search_CLD(query, docType).then(res => {
            setData(res.data)
            setArticles(res.data.articles)
            localStorage.setItem('articles', JSON.stringify(res.data))
            // const indexOfLastPost = currentPage * 10;
            // const indexOfFirstPost = indexOfLastPost - 10;
            // setCurrentPageData(res.data.articles.slice(indexOfFirstPost, indexOfLastPost));
        })
    }, [location]);


    // const firstPageIndex = (currentPage - 1) * PageSize;
    // const lastPageIndex = firstPageIndex + PageSize;
    // articles = articles.slice(firstPageIndex, lastPageIndex);


    // console.log(articles)
    // console.log(articles.length)

    const indexOfLastPost = currentPage * 10;
    const indexOfFirstPost = indexOfLastPost - 10;
    const currentPageData = articles.slice(indexOfFirstPost, indexOfLastPost);

    //Change page
    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
        console.log(currentPageData)
        console.log("paginate + pageNumber:" + pageNumber)
    }


    const settings=(article)=>{
        console.log(article)
        localStorage.setItem('article',JSON.stringify(article.fields))
        if(localStorage.getItem('article'))
            navigate(`/detail/${docType}/${query}`);
    }

    return(
        <div className='ResultPage'>
            <CLDNavBar
                query={query}
                docType={docType}
            />
            <div className="container">
                <CLDResultsListDiv>
                    {data && <div>
                        <b>{data.articles.length} documents found {query ?
                            <span>for query- <i>{query}</i> {docType !== ' ' ?
                                <span> under the document type <i>{docType}</i></span> : 'All'}</span> : ''}
                        </b>
                    </div>

                    }
                    <CLDPagination
                        currentPage={currentPage}
                        totalCount={articles.length}
                        pageSize={PageSize}
                        onPageChange={paginate}
                    />
                    {data && (currentPageData.map(article => (<a onClick={() => {
                            settings(article)
                        }}>
                            <CLDResultCard>
                                <CLDResultCardBody>
                                    <CLDResultCardTitle
                                        className="font-weight-bold lead">{article.fields.title}</CLDResultCardTitle>
                                    <Card.Subtitle
                                        className="mb-2 text-white">Publication: {article.fields.publicationName}</Card.Subtitle>
                                    <CLDResultCardText className="text-white">
                                        {article.fields.description}
                                    </CLDResultCardText>
                                </CLDResultCardBody>
                            </CLDResultCard>
                        </a>)
                    ))}
                </CLDResultsListDiv>
                <CLDPagination
                    currentPage={currentPage}
                    totalCount={articles.length}
                    pageSize={PageSize}
                    onPageChange={paginate}
                />
            </div>
        </div>
    )
}

export default Result;