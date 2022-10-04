import * as test from 'whatwg-url';

console.log(
  test
    .serializeURL({
      scheme: 'mongodb',
      host: 'localhost',
      port: 27017,
      password: 'mongosecret',
      username: 'mongoadmin',
      path: '',
      query: null,
      fragment: null,
    })
    .toString()
);
