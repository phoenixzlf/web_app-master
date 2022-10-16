import React, {useState, useEffect, useRef } from 'react'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';
import CLDNavBar from "./styledComponents/CLDNavBar";
import {data_vis_db, data_vis_onSearch_cat_CLD, get_db_Detail} from "../utils/api";
import { Pie, Bar, getElementAtEvent } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import {colorListCat, colorListCatInner, colorListYear, colorListYearInner} from "./styledComponents/CLDPlotColor";

const CLDHomeCard = styled(Card)`
  background-color: #002855;
  margin-top: 5vh;
  padding: 0;
`

const CLDPieChartCard = styled(Card)`
  background-color: #002855;
  margin-top: 5vh;
  padding: 0;
`

export const CLDHomeCardTitle = styled(Card.Title)`
    color: #E84A27;
    padding: 15px;
`

const StyledBarDiv = styled.div`
    display: flex;
    margin: 100px auto;
    min-height: 1000px;
`
const StyledBarDiv1 = styled.div`
    display: flex;
    width: auto;
    margin: 30px auto;
`


function Home() {

    const [data, setData] = useState('');
    const [dataVis, setDataVis] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [yearList, setYearList] = useState([]);
    const [clusterList, setClusterList] = useState([]);
    const [selectedCluster, setSelectedCluster] = useState('');
    const [chartDataYearXCatY, setChartDataYearXCatY] = useState({});
    const [article_by_year_category, setArticle_by_year_category] = useState({});
    const [article_by_category_year, setArticle_by_category_year] = useState({});

    const [chartDataCatXNumberY, setChartDataCatXNumberY] = useState({});
    const [chartDataYearXNumberY, setChartDataYearXNumberY] = useState({});

    const chartRef = useRef();
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
        ArcElement
    );
    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Number of Articles per year by Cluster',
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
        maintainAspectRatio: false,
    };
    const optionsYear = {
        plugins: {
            title: {
                display: true,
                    text: `Number of Literature Pieces in "${selectedYear}"`
            },
            legend: {
                display: true,
                    position: "bottom"
            }
        },
        maintainAspectRatio: true,
    }


    const onClick = (event) => {
        console.log(getElementAtEvent(chartRef.current, event));
    }

    React.useState(() => {
        get_db_Detail().then(res => {
            setData(res.data)
        })
        data_vis_db().then(res => {
            setDataVis(res.data)
            setArticle_by_year_category(res.data.article_by_year_category)
            setArticle_by_category_year(res.data.article_by_category_year)
            const article_by_year_category = res.data.article_by_year_category
            setClusterList(Object.keys(article_by_year_category))
            const article_by_category_year = res.data.article_by_category_year
            setYearList(Object.keys(article_by_category_year).reverse())
            // console.log(article_by_year_category)
            // console.log(article_by_category_year)
            let dataValueList = []
            let iColor = 0
            for (let cat in article_by_year_category) {
                const thisValueList = {
                    label: `Number of Articles in ${cat}`,
                    data: Object.values(article_by_year_category[cat]),
                    backgroundColor: colorListCat[iColor]
                }
                dataValueList.push(thisValueList)
                iColor++
            }
            setChartDataYearXCatY({
                labels: Object.keys(article_by_category_year),
                datasets: dataValueList,
            })

        })
    })

    const changeSelectYear = ({target: {value}}) => {
        if (value !== undefined && value !== "") {
            setChartDataCatXNumberY({
                labels: Object.keys(article_by_category_year[value]),
                datasets: [{
                    label: `Number of Articles in ${value}`,
                    data: Object.values(article_by_category_year[value]),
                    backgroundColor: colorListCatInner,
                    borderColor: colorListCat,
                }]
            })
            setSelectedYear(value)
        }
    }

    const changeSelectCluster = ({target: {value}}) => {
        if (value !== undefined && value !== "") {
            setChartDataYearXNumberY({
                labels: Object.keys(article_by_year_category[value]),
                datasets: [{
                    label: `Number of Articles in ${value}`,
                    data: Object.values(article_by_year_category[value]),
                    backgroundColor: colorListYearInner,
                    borderColor: colorListYear,
                }]
            })
            setSelectedCluster(value)
        }
    }

    return (
        <div className="Homepage">
            <CLDNavBar />
            <Container>
                <Row>
                    <CLDHomeCard>
                        <Card.Body>
                            <CLDHomeCardTitle className="font-weight-bold lead">Respository Status</CLDHomeCardTitle>
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
                </Row>

                {dataVis
                    ? (<>
                            <StyledBarDiv className="row">
                                <Bar options={options} data={chartDataYearXCatY}/>
                            </StyledBarDiv>
                            <StyledBarDiv className="row">
                                <Col>
                                    <CLDPieChartCard>
                                        <Card.Body>
                                            <CLDHomeCardTitle className="font-weight-bold lead">Number of Articles by Cluster in Year</CLDHomeCardTitle>
                                            <hr color='white'/>
                                            <Form.Select
                                                aria-label="Default select example"
                                                onChange={changeSelectYear}
                                                value={selectedYear}
                                            >
                                                <option value="">Choose Year</option>
                                                {yearList.map(year => (<option value={year}>{year}</option>))}
                                            </Form.Select>
                                            {selectedYear && <Pie data={chartDataCatXNumberY}/>}
                                        </Card.Body>
                                    </CLDPieChartCard>
                                </Col>

                                <Col>
                                    <CLDPieChartCard>
                                        <Card.Body>
                                            <CLDHomeCardTitle className="font-weight-bold lead">Number of Articles by Year in Cluster</CLDHomeCardTitle>
                                            <hr color='white'/>
                                            <Form.Select
                                                aria-label="Default select example"
                                                onChange={changeSelectCluster}
                                                value={selectedCluster}
                                            >
                                                <option value="">Choose Cluster</option>
                                                {clusterList.map(cluster => (<option value={cluster}>{cluster}</option>))}
                                            </Form.Select>
                                            {selectedCluster && <Pie data={chartDataYearXNumberY}/>}
                                        </Card.Body>
                                    </CLDPieChartCard>
                                </Col>



                            </StyledBarDiv>
                    </>)
                    : (<StyledBarDiv className="row">
                        <StyledBarDiv1>
                            <Spinner animation="border" />
                        </StyledBarDiv1>
                    </StyledBarDiv>)}
            </Container>
        </div>
    )
}

export default Home;