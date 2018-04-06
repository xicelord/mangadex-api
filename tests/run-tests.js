//Set environment variable
process.env.NODE_ENV = 'test';

//Execute tests
require('./helpers');
require('./chapter_handler');
require('./chapters_handler');
require('./group_handler');
require('./groups_handler');
require('./manga_handler');
require('./mangas_handler');
require('./user_handler');
