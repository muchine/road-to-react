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
        
        return (
            <div className="App">
                <h2>{message}</h2>
                <form>
                    <input type="text" onChange={this.onSearchChange}/>
                </form>
                {this.renderItems()}
            </div>
        );
    }
    
    renderItems = () => {
        return this.state.articles
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
                        <button onClick={() => this.onDismiss(item.objectId)} type="button">
                            Dismiss
                        </button>
                    </span>
                </div>
            );
    };
    
    isSearchedItem = (item) => {
        const keyword = this.state.searchTerm;
        return item.title.toLowerCase().includes(keyword.toLowerCase());
    };
    
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

export default App;
