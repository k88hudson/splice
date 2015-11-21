const req = require.context('.', true, /Reducer\.js$/);
const allReducers = {};

req.keys().forEach(fileName => {
  const reducers = req(fileName);
  Object.keys(reducers).forEach(key => {
    if (key in allReducers) {
      throw new Error(`Tried to name conflict for reducer "${key}" in ${fileName}`);
    } else {
      allReducers[key] = reducers[key];
    }
  });
});

export default allReducers;
