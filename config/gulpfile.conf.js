

// var gulp = require("gulp");
import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import pm2 from 'pm2';


gulp.task('serve:chat', function (done) {
  nodemon({
    script: 'server/chat-server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development', 'CHAT_PORT': 8000 }
  , done: done
  })
})

gulp.task('serve', function (done) {
  nodemon({
    script: 'server/server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  , done: done
  })
})


gulp.task('serve:live', function (done) {
  pm2.connect(true, function () {
    pm2.start({
      name: 'admin',
      script: 'server.js',
    }, function () {
      pm2.streamLogs('all', 1);
      done();
    });
  });
})

