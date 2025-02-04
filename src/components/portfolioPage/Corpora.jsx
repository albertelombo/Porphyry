import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import by from 'compare-func';
import memoize from 'memoize-one';
import ItemCreator from './ItemCreator.jsx';
import GeographicMap from './GeographicMap.jsx';
import { Items } from '../../model.js';
import conf from '../../config.js';

class Corpora extends Component {
  state = {
    criteria: 'name'
  };

  sort = memoize((items, criteria) => items.sort(by(`${criteria}.0`)));

  render() {
    let itemsData = this.sort(this.props.items, this.state.criteria);
    let items = itemsData.map(x =>
      <Item key={x.id} item={x} criteria={this.state.criteria} />
    );
    let attributes = new Items(this.props.items).getAttributeKeys().sort(by());
    let options = this._getOptions(attributes);
    let count = this.props.items.length;
    let total = this.props.from;
    let listIds = this.props.ids.map((corpus) =>
      <div key={corpus}> {corpus} <ItemCreator corpus={corpus} conf={this.props.conf} /></div>
    );
    return (
      <div className="col-md-8 p-0 p-md-4">
        <div className="Subject">
          <h2 className="h4 font-weight-bold text-center CorporaList">
            {listIds}
            <span className="badge badge-pill badge-light ml-4">{count} / {total}</span>
          </h2>
          <GeographicMap items={this.props.items} conf={this.props.conf} />
          <div className="selectAttributes mt-0 mt-md-2">
            <Trans>triés par</Trans>
            &nbsp;
            <select
              id="attribut"
              onChange={this.handleSort}
              value={this.state.criteria}
            >
              {options}
            </select>
          </div>
          <div className="Items m-3">
            {items}
          </div>
        </div>
      </div>
    );
  }

  handleSort = (e) => {
    this.setState({
      criteria: e.target.value
    });
  }

  _getOptions(arr) {
    return arr.map((attribute) => (
      <option key={attribute} value={attribute}> {attribute} </option>
    ));
  }
}

function Item(props) {
  let [rmes, setRmes] = useState(false);
  conf.then(settings => {
    if (settings.customization && settings.customization['use_case'])
      setRmes((settings.customization['use_case'] === 'rmes') || false);
  });
  let uri = `/item/${props.item.corpus}/${props.item.id}`;
  let name = [props.item.name].join(', '); //Name can be an array
  let thumbnail = props.item.thumbnail && <img src={props.item.thumbnail} alt={name}/>;
  let criteria = (props.criteria !== 'name')
    && <div className="About"> {props.item[props.criteria]} </div>;
  return (
    <div className="Item">
      <Link to={{
        pathname: uri,
        state: { selectedUri: window.location.search }
      }}>
        {(!rmes) && thumbnail}
        <div>{name}</div>
      </Link>
      {criteria}
    </div>
  );
}

export default Corpora;
