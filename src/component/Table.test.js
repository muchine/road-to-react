import React from 'react';
import Table from "./Table";
import Item from "model/Item";
import ReactDOM from "react-dom";
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from "react-test-renderer";

Enzyme.configure({adapter: new Adapter()})

describe('Table', () => {
    const props = {
        items: [
            new Item('y', '1', '1', 1, 2),
            new Item('z', '1', '1', 1, 2),
        ],
        sortKey: 'TITLE',
        isSortReverse: false
    };
    
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(<Table {...props} />, div);
    });
    
    it('shows two items in list', () => {
        const element = shallow(
            <Table {...props}/>
        );
        expect(element.find('.table-row').length).toBe(2);
    });
    
    test('has a valid snapshot', () => {
        const component = renderer.create(
            <Table {...props}/>
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    
});