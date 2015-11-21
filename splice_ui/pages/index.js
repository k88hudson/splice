import exportAll from '../lib/exportAll';

export default exportAll(require.context('.', true, /Page\.js$/));
