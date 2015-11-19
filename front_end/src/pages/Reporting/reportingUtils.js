import {
  GROUP_BY_FIELDS,
  BASE_FIELDS
} from './reportingConsts';

export function queryParser(query) {
  if (!query) return {};
  const output = _.clone(query);
  Object.keys(output).forEach(key => {
    if (key === 'group_by' && typeof(output[key]) === 'string') output[key] = [output[key]];
    if (!output[key]) delete output[key];
    if (['showEditor', 'showAllFilters'].indexOf(key) !== -1) delete output[key];
    if (['account_id', 'campaign_id'].indexOf(key) !== -1) output[key] = +output[key];
  });
  return output;
}

export function createFieldSet(groupBy) {
  if (!groupBy) return null;
  const fields = [];
  groupBy.forEach(field => {
    const groupByField = _.clone(GROUP_BY_FIELDS[field]);
    groupByField.key = field;
    fields.push(groupByField);
  });
  BASE_FIELDS.forEach(field => {
    fields.push(_.clone(field));
  });
  return fields;
}
