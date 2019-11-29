import React, {Component} from 'react';

class Search extends Component {
    componentDidMount(): void {
        if (this.input) this.input.focus();
    }
    
    render() {
        const {value, onChange, onSubmit, children} = this.props;
        return (
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    ref={e1 => this.input = e1}
                />
                <button type="submit">
                    {children}
                </button>
            </form>
        );
    }
}

export default Search;