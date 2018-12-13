import test from 'ava';
import readFile from './helpers/read-file';

test('dummy file has code removed', async t => {
  const file = await readFile('dist/assets/dummy.js');

  t.notRegex(file, /@ember-decorators\/argument/);
});

test('vendor file has code removed', async t => {
  const file = await readFile('dist/assets/vendor.js');

  t.notRegex(file, /@ember-decorators\/argument/);
});
