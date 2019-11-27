import React, {Component} from 'react';
import './App.css';

const columnSize = {
    large: {width: '40%'},
    mid: {width: '30%'},
    small: {width: '10%'}
};

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
console.log(url);

class Item {
    constructor(id, title, author, commentCount, points) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.commentCount = commentCount;
        this.points = points;
    }
}

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
                { error ?
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
        fetch(`${PATH_BASE}/search?query=${query}&page=${page}&hitsPerPage=10`)
            .then(response => response.json())
            .then(result => this.onFetchedItems(result))
            .catch(error => this.setState({ error }));
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

const Search = ({value, onChange, onSubmit, children}) =>
    <form onSubmit={onSubmit}>
        <input
            type="text"
            value={value}
            onChange={onChange}
        />
        <button type="submit">
            {children}
        </button>
    </form>;

class Table extends Component {
    render() {
        return (
            <div className="table">
                {this.renderItems(this.props.items)}
            </div>
        )
    }
    
    renderItems = (items) => {
        return items
            .map(item =>
                <div key={item.id} className="table-row">
                    <span style={columnSize.large}>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span style={columnSize.mid}>{item.author}</span>
                    <span style={columnSize.small}>{item.commentCount}</span>
                    <span style={columnSize.small}>{item.points}</span>
                    <span style={columnSize.small}>
                        <Button
                            className="button-inline"
                            onClick={() => this.props.onDismiss(item.id)}
                        >
                            Dismiss
                        </Button>
                    </span>
                </div>
            );
    };
}

class Button extends Component {
    render() {
        const {
            onClick,
            className = '',
            children
        } = this.props;
        
        return (
            <button
                onClick={onClick}
                className={className}
                type="button">
                {children}
            </button>
        )
    }
}

export default App;
