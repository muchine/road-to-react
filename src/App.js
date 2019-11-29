import React, {Component} from 'react';
import Button from "./component/Button";
import Table from "./component/Table";
import Search from "./component/Search";
import Item from "./model/Item";
import axios from 'axios';
import PropTypes from 'prop-types';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
console.log(url);

class Response {
    constructor(items, page) {
        this.items = items;
        this.page = page;
    }
}

class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            responses: {},
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null
        };
    }
    
    render() {
        const {
            responses,
            searchTerm,
            searchKey,
            error
        } = this.state;
        
        const response = responses[searchKey];
        const page = response ? response.page : 0;
        const items = response ? response.items : [];
        
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onChangedSearchTerm}
                        onSubmit={this.onClickSearch}
                    >
                        Search
                    </Search>
                </div>
                {error ?
                    <div className="interactions">
                        <p>Something went wrong.</p>
                    </div>
                    :
                    <Table
                        items={items}
                        pattern={searchTerm}
                        onDismiss={this.onDismiss}
                    />
                }
                <div className="interactions">
                    <Button onClick={() => this.fetchStories(searchKey, page + 1)}>
                        More
                    </Button>
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        this.fetchStories(searchTerm);
    }
    
    fetchStories = (query, page = 0) => {
        axios.get(`${PATH_BASE}/search?query=${query}&page=${page}&hitsPerPage=10`)
            .then(result => this.onFetchedItems(result.data))
            .catch(error => this.setState({error}));
    };
    
    onFetchedItems = (result) => {
        const {hits, page} = result;
        const items = hits.map(item => new Item(item.objectID, item.title, item.author, item.num_comments, item.points));
        
        const {searchKey, responses} = this.state;
        const updated = [
            ...(responses[searchKey] ? responses[searchKey].items : []),
            ...items
        ];
        
        this.setState({
            responses: {
                ...responses,
                [searchKey]: new Response(updated, page)
            }
        });
    };
    
    onClickSearch = (event) => {
        const {searchTerm, responses} = this.state;
        this.setState({searchKey: searchTerm});
        
        event.preventDefault();
        if (!responses[searchTerm]) this.fetchStories(searchTerm);
    };
    
    onChangedSearchTerm = (event) => {
        this.setState({
            searchTerm: event.target.value
        });
    };
    
    onDismiss = (id) => {
        const {searchKey, responses} = this.state;
        const response = responses[searchKey];
        const updated = response.items.filter(item => item.id !== id);
        
        this.setState({
            responses: {
                ...responses,
                [searchKey]: new Response(updated, response.page)
            }
        });
    };
}

export default App;