import R from 'ramda';

export const getPins = (state) => R.pipe(
  R.prop('pins')
)(state);

export const getPinsByNodeId = (state, props) => R.pipe(
  getPins,
  R.filter((pin) => pin.nodeId === props.id)
)(state, props);

export const getPinsByIds = (state, props) => R.pipe(
  getPins,
  R.values,
  R.reduce((p, pin) => {
    let result = p;
    if (props && props.pins && props.pins.indexOf(pin.id) !== -1) {
      result = R.assic(pin.id, pin, p);
    }
    return result;
  }, {})
)(state, props);
