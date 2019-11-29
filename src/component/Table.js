import React, {Component} from 'react';
import Button from './Button';
import Item from 'model/Item';
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({adapter: new Adapter()});

const columnSize = {
    large: {width: '40%'},
    mid: {width: '30%'},
    small: {width: '10%'}
};

type Props = {
    items: Array<Item>
};

class Table extends Component<Props> {
    render() {
        return (
            <div className="table">
                {this.renderItems(this.props.items)}
            </div>
        )
    }
    
    renderItems = (items: Array<Item>) => {
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

export default Table;