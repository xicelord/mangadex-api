//Set environment variable
process.env.NODE_ENV = 'test';

//Execute tests
require('./helpers')
require('./chapter_handler');
require('./group_handler');
