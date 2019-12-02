import React, {Component} from 'react';
import Button from './Button';
import Item from 'model/Item';
import classNames from 'classnames';

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {sortBy} from "lodash";

Enzyme.configure({adapter: new Adapter()});

const columnSize = {
    large: {width: '40%'},
    mid: {width: '30%'},
    small: {width: '10%'}
};

type Props = {
    items: Array<Item>,
    sortKey: String,
    onSort: Function,
    isSortReverse: Boolean,
    onDismiss: Function
};

const SORTS = {
    NONE: items => items,
    TITLE: items => sortBy(items, 'title'),
    AUTHOR: items => sortBy(items, 'author'),
    COMMENTS: items => sortBy(items, 'commentCount').reverse(),
    POINTS: items => sortBy(items, 'points').reverse()
};

const Sort = ({sortKey, onSort, activeSortKey, children}) => {
    const sortClass = classNames(
        'button-inline',
        { 'button-active': sortKey === activeSortKey}
    );
    
    return (
        <Button
            onClick={() => onSort(sortKey)}
            className={sortClass}
            activeSortKey={activeSortKey}
        >
            {children}
        </Button>
    );
};


const SortCell = ({style, sortKey, onSort, activeSortKey, children}) =>
    <span style={style}>
        <Sort sortKey={sortKey} onSort={onSort} activeSortKey={activeSortKey}>
            {children}
        </Sort>
    </span>;

class Table extends Component<Props> {
    render() {
        const {items, sortKey, onSort, isSortReverse} = this.props;
        const sorted = SORTS[sortKey](items);
        return (
            <div className="table">
                {this.renderHeader(onSort, sortKey)}
                {this.renderItems(isSortReverse ? sorted.reverse() : sorted)}
            </div>
        )
    }
    
    renderHeader = (onSort, sortKey) =>
        <div className='table-header'>
            <SortCell style={{width: '40%'}} sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey}>Title</SortCell>
            <SortCell style={{width: '30%'}} sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey}>Author</SortCell>
            <SortCell style={{width: '10%'}} sortKey={'COMMENTS'} onSort={onSort} activeSortKey={sortKey}>Comments</SortCell>
            <SortCell style={{width: '10%'}} sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey}>Points</SortCell>
            <span style={{width: '10%'}}>
                Archive
            </span>
        </div>;
    
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