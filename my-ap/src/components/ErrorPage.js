import React,{useState,useEffect} from 'react'
import {useParams} from "react-router";
import CLDNavBar from "./styledComponents/CLDNavBar";
import styled from 'styled-components';
import Card from "react-bootstrap/Card";

const DivNotFound = styled.div`
  margin-top: 5vh;
  padding: 0;
`


export default function ErrorPage() {
    const {query, docType} = useParams();


    return (
        <div>
            <CLDNavBar
                query={query}
                docType={docType}
            />
            <DivNotFound>Please enter your KeyPhrase in the search bar</DivNotFound>
        </div>
    )
}