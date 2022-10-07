import axios from 'axios'

const CLDsearch = axios.create({
    timeout: 5000,
    baseURL: 'http://127.0.0.1:8000/litlookup',
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
        url: `/?detail=1`,
    })
}