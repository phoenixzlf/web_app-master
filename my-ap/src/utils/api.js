import axios from 'axios'

const CLDsearch = axios.create({
    timeout: 50000,
    // baseURL: 'http://0.0.0.0:8000/litlookup',
    // baseURL: 'http://localhost:8000/litlookup',
    // baseURL: 'http://127.0.0.1:8000/litlookup',
    baseURL: 'http://3.23.88.71:80/litlookup',
})

//change the base URL for productive versions
// local: http://127.0.0.1:8000/litlookup/?kw_search=${query}&subtype=${docType}

export function search_CLD(query, docType) {
    return CLDsearch({
        method: 'GET',
        url: `/?kw_search=${query}&subtype=${docType}`,
    })
}

export function get_db_Detail() {
    return CLDsearch({
        method: 'GET',
        url: `/?detail=1&damnNginx=1`,
    })
}

export function data_vis_onSearch_CLD(query, docType) {
    return CLDsearch({
        method: 'GET',
        url: `/?data_vis1=1&kw_search=${query}&subtype=${docType}`,
    })
}

export function data_vis_onSearch_cat_CLD(query, docType) {
    return CLDsearch({
        method: 'GET',
        url: `/?data_vis2=1&kw_search=${query}&subtype=${docType}`,
    })
}

export function data_vis_db() {
    return CLDsearch({
        method: 'GET',
        url: `/?data_vis3=1&damnNginx=1`,
    })
}