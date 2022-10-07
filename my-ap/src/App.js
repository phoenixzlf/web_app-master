import React, { Fragment, useEffect } from 'react';
import './App.css';
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DocDetail from './components/DocDetail';
import Results from './components/Results';
import DataVisualization from "./components/DataVisualization";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Home/>} />
                    <Route exact path='/data_vis' element={<DataVisualization/>} />
                    <Route path='/search' element={<Results/>} />
                    <Route path='/search/:docType/:query' element={<Results/>} />
                    <Route path='/detail' element={<DocDetail/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
