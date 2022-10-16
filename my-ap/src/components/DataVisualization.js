import CLDNavBar from "./styledComponents/CLDNavBar";
import React, {useState} from "react";
import {data_vis_onSearch_cat_CLD, data_vis_onSearch_CLD, search_CLD} from "../utils/api";
import {useLocation} from "react-router-dom";
import {useParams} from "react-router";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import styled from "styled-components";

const StyledBarDiv1 = styled.div`
    display: flex;
    margin: 30px auto;
    height: 30vh;
    max-height: 800px;
    max-width: 1000px;
`

const StyledBarDiv2 = styled.div`
    display: flex;
    margin: 30px auto;
    height: 40vh;
    max-height: 800px;
    max-width: 1000px;
`

function DataVisualization() {
    const [dataYear, setDataYear] = React.useState("")
    const [dataCat, setDataCat] = React.useState("")
    const location = useLocation();

    let {query, docType} = useParams();
    if (query === undefined || docType === undefined) {
        query = " ";
        docType = " ";
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [chartDataYear, setChartDataYear] = useState({});
    const [chartDataType, setChartDataType] = useState({});

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );


    React.useState(() => {
        data_vis_onSearch_CLD(query, docType).then(res => {
            setDataYear(res.data.articles_by_year)
            const articlesByYear = res.data.articles_by_year
            setChartDataYear({
                labels: Object.keys(articlesByYear),
                datasets: [
                    {
                        label: "Number of Articles",
                        data: Object.values(articlesByYear),
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    }
                ]
            })
        })
        data_vis_onSearch_cat_CLD(query, docType).then(res => {
            setDataCat(res.data.article_by_category)
            const articlesByCat = res.data.article_by_category
            console.log(articlesByCat)
            console.log(Object.keys(articlesByCat))
            console.log(Object.values(articlesByCat))
            setChartDataType({
                labels: Object.keys(articlesByCat),
                datasets: [
                    {
                        label: "Number of Articles",
                        data: Object.values(articlesByCat),
                        backgroundColor: 'rgba(50, 50, 200, 0.8)',
                    }
                ]
            })
        })
    })

    React.useEffect(() => {
        data_vis_onSearch_CLD(query, docType).then(res => {
            setDataYear(res.data.articles_by_year)
            const articlesByYear = res.data.articles_by_year
            setChartDataYear({
                labels: Object.keys(articlesByYear),
                datasets: [
                    {
                        label: "Number of Articles",
                        data: Object.values(articlesByYear),
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    }
                ]
            })
        })
        data_vis_onSearch_cat_CLD(query, docType).then(res => {
            setDataCat(res.data.article_by_category)
            const articlesByCat = res.data.article_by_category
            console.log(articlesByCat)
            setChartDataType({
                labels: Object.keys(articlesByCat),
                datasets: [
                    {
                        label: "Number of Articles",
                        data: Object.values(articlesByCat),
                        backgroundColor: 'rgba(50, 50, 200, 0.8)',
                    }
                ]
            })
        })
    }, [location]);

    return(
        <div>
            <CLDNavBar
                query={query}
                docType={docType}
            />
            <StyledBarDiv1>
                {dataYear && <Bar
                    data={chartDataYear}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: `Number of Literature Pieces Found Related to "${query}" per year`
                            },
                            legend: {
                                display: true,
                                position: "bottom"
                            }
                        },
                        maintainAspectRatio: false,
                    }}
                />}
            </StyledBarDiv1>
            <StyledBarDiv2>
                {dataCat && <Bar
                    data={chartDataType}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: `Number of Literature Pieces Found Related to "${query}" per Cluster`
                            },
                            legend: {
                                display: true,
                                position: "bottom"
                            }
                        },
                        maintainAspectRatio: false,
                    }}
                />}
            </StyledBarDiv2>

        </div>
    )
}

export default DataVisualization