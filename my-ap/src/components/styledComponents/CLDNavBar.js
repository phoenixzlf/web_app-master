import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React from "react";
import styled from 'styled-components';
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {useParams} from "react-router";
import Card from "react-bootstrap/Card";
import {search_CLD} from "../../utils/api";

const DocTypeTag = styled.a`
  color: #fff !important;
  //background-color: lightgrey;
  padding: 0 0.3rem;
`

const CLDNavLink = styled(Nav.Link)`
  color: #fff !important;
`

// const DocTypeSelector = styled.select`
//   padding: 0 1rem;
//   max-height: 70px;
// `

function CLDNavBar(props) {
    const navigate = useNavigate();
    const location = useLocation();
    let [query, setQuery] = React.useState("")
    let [docType, setDocType] = React.useState("")
    let preventReactStrict = true;



    React.useState(() => {
            if (props.query === undefined || props.docType === undefined) {
                setQuery("")
                setDocType(" ")
            } else {
                setQuery(props.query)
                setDocType(props.docType)
            }
        }
    )

    React.useEffect(() => {
        if (props.query === undefined || props.docType === undefined) {
            setQuery("")
            setDocType(" ")
        } else {
            setQuery(props.query)
            setDocType(props.docType)
        }
    }, [location]);

    function search(e) {
        e.preventDefault();
        //console.log(query, docType)
        navigate(`/search/${docType}/${query}`)
        window.location.reload()
    }

    function onInput({target: {value}}) {
        setQuery(value)
    }

    function onChange({target: {value}}) {
        setDocType(value)
    }

    // prevent default query parsed to url when enter pressed
    function handleKeyPress(target) {
        if (target.charCode === 13) {
            target.preventDefault();
            navigate(`/search/${docType}/${query}`)
            window.location.reload()
        }
    }

    return (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/">Cyber Literature Databases</Navbar.Brand>
            <CLDNavLink href="/data_vis">Data Visualization</CLDNavLink>
            <CLDNavLink href="/search">Search</CLDNavLink>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav
                    className="ms-auto my-2 my-lg-2 pe-5 ps-5"
                    style={{ maxHeight: '100px' }}
                >
                    <DocTypeTag>
                        Document Type
                    </DocTypeTag>
                    <select className="form-select" aria-label="Default select example" name="docType" onChange={onChange} value={docType} >
                        {/*<option selected>Select the document type</option>*/}
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
                        onChange={onInput}
                        onKeyPress={handleKeyPress}
                    />
                    <Button variant="outline-warning" onClick={search}>Search</Button>
                </Form>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    )
}

export default CLDNavBar;