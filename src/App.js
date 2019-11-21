import React, {Component} from 'react';
import './App.css';

const articles = [
    {
        title: 'React',
        url: 'https://reactjs.org',
        author: 'Jordan Walke',
        commentCount: 3,
        points: 4,
        objectId: 0
    }, {
        title: 'Redux',
        url: 'https://redux.js.org',
        author: 'Dan Abramov, Andrew Clark',
        commentCount: 2,
        points: 5,
        objectId: 1
    }
];

const columnSize = {
    large: {width: '40%'},
    mid: {width: '30%'},
    small: {width: '10%'}
};

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
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

class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            searchTerm: DEFAULT_QUERY
        };
    }
    
    render() {
        const {
            items,
            searchTerm
        } = this.state;
        
        console.log(items[0]);
        
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
                {items &&
                <Table
                    items={items}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
                />
                }
            </div>
        );
    }
    
    componentDidMount() {
        this.fetchStories();
    }
    
    fetchStories = () => {
        const {searchTerm} = this.state;
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.onFetchedItems(result.hits))
            .catch(error => error);
    };
    
    onFetchedItems = (fetchedItems) => {
        const items = fetchedItems.map(item =>
            new Item(item.objectID, item.title, item.author, item.num_comments, item.points)
        );
        
        this.setState({items: items});
    };
    
    onClickSearch = (event) => {
        this.fetchStories();
        event.preventDefault();
    };
    
    onChangedSearchTerm = (event) => {
        this.setState({
            searchTerm: event.target.value
        });
    };
    
    onDismiss = (id) => {
        const updated = this.state.items.filter(item => item.id !== id);
        this.setState({items: updated});
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
