import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card';
import styled from 'styled-components';
import CLDNavBar from "./styledComponents/CLDNavBar";
import {get_db_Detail} from "../utils/api";

const CLDHomeCard = styled(Card)`
  margin-top: 5vh;
  padding: 0;
`


function Home() {
    const [data, setData] = useState('');
    React.useState(() => {
        get_db_Detail().then(res => {
            setData(res.data)
        })
    })

    return (
        <div className="Homepage">
            <CLDNavBar />
            <div className='container'>
                <div className="row ">
                    <CLDHomeCard>
                        <Card.Body className="bg-dark">
                            <Card.Title className="text-warning font-weight-bold lead">Respository Status</Card.Title>
                            <hr color='white'/>
                            {data?(<Card.Text className="text-white lead">

                                <p><b>Number of articles: </b> {data.num_articles}</p>
                                <p><b>Publication Sources:</b> {data.num_sources}</p>
                                <p><b>Last Updated:</b> {data.last_updated} </p>

                            </Card.Text>):(<Card.Text className="text-white lead">

                                <p><b>Number of articles: </b> 15065</p>
                                <p><b>Publication Sources:</b> 4540</p>
                                <p><b>Last Updated:</b> April 19, 2022 </p>

                            </Card.Text>)}
                        </Card.Body>
                    </CLDHomeCard>
                </div>
            </div>
        </div>
    )
}

export default Home;