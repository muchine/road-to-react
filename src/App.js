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

class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            articles,
            searchTerm: ''
        };
    }
    
    render() {
        const message = 'Welcome to the Road to learn React!!';
        const {
            articles,
            searchTerm
        } = this.state;
        
        return (
            <div className="App">
                <h2>{message}</h2>
                <Search
                    value={searchTerm}
                    onChange={this.onSearchChange}
                />
                <Table
                    items={articles}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
                />
            </div>
        );
    }
    
    onSearchChange = (event) => {
        this.setState({
            searchTerm: event.target.value
        });
    };
    
    onDismiss = (objectId) => {
        const updated = this.state.articles.filter(item => item.objectId !== objectId);
        this.setState({articles: updated});
    };
}

class Search extends Component {
    render() {
        const {value, onChange} = this.props;
        return (
            <form>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                />
            </form>
        )
    }
}

class Table extends Component {
    
    render() {
        return (
            <div>
                {this.renderItems(this.props.items)}
            </div>
        )
    }
    
    renderItems = (items) => {
        return items
            .filter(item => this.isSearchedItem(item))
            .map(item =>
                <div key={item.objectId}>
                    <span>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span>{item.author}</span>
                    <span>{item.commentCount}</span>
                    <span>{item.points}</span>
                    <span>
                        <button
                            type="button"
                            onClick={() => this.props.onDismiss(item.objectId)}>
                            Dismiss
                        </button>
                    </span>
                </div>
            );
    };
    
    isSearchedItem = (item) => {
        const keyword = this.props.pattern;
        return item.title.toLowerCase().includes(keyword.toLowerCase());
    };
}

export default App;
