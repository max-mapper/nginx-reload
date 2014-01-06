var test = require('tape')
var Reloader = require('./')
var request = require('request')
var pid = '/var/run/nginx.pid'

function notRunning(cb) {
  request('http://localhost', function(e, r) {
    cb(e && e.code === 'ECONNREFUSED')
  })
}

test('nothing should be running on port 80', function(t) {
  notRunning(function(isNotRunning) {
    t.true(isNotRunning, 'should not be running')
    t.end()
  })
})

test('onChange should be false and nothing should be running on 80', function(t) {
  var sentReload = false
  var change = 0
  var reloader = Reloader(pid, function onChange(running) {
    change++
    if (change === 1) {
      t.false(running, 'onChange running false')
      notRunning(function(isNotRunning) {
        t.true(isNotRunning, 'should not be running')
        reloader.end()
        t.end()
      })
    }
    if (change === 2) t.true(running, 'onChange running true')

  })
})

test('.start() should start nginx on 80', function(t) {
  var change = 0
  var reloader = Reloader(pid, function onChange(running) {
    change++
    if (change === 1) {
      t.false(running, 'onChange 1 running false')
      reloader.start(function(err) {
        t.false(err, 'no start err')
        if (err) {
          console.error(err.message)
          reloader.stop()
          reloader.end()
        }
      })
    }
    if (change === 2) {
      t.true(running, 'onChange 2 running true')
      notRunning(function(isNotRunning) {
        t.false(isNotRunning, 'should be running')
        reloader.stop(function(err) {
          t.false(err, 'no stop error')
        })
      })
    }
    if (change === 3) {
      t.false(running, 'onChange 3 running false')
      notRunning(function(isNotRunning) {
        t.true(isNotRunning, 'should not be running')
        reloader.end()
        t.end()
      })
    }
  })
})

test('.reload() should restart nginx without triggering an onChange', function(t) {
  var change = 0
  var reloader = Reloader(pid, function onChange(running) {
    change++
    if (change === 1) {
      t.false(running, 'onChange status is false')
      reloader.start(function(err) {
        t.false(err, 'no start err')
        if (err) {
          console.error(err.message)
          reloader.stop()
          reloader.end()
        }
      })
    }
    
    if (change === 2) {
      t.true(running, 'onChange 2 running true')
      reloader.reload(function(err, stdout, stderr) {
        t.false(err, 'no reload err')
        notRunning(function(isNotRunning) {
          t.false(isNotRunning, 'should be running')
          reloader.stop()
          reloader.end()
          t.end()
        })
      })
    }
  })
})

