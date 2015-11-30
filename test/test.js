var test = require('tap').test;

var asyncReplace = require('../async-replace');

test('async-replace', function(t) {
    t.test('no match local', function(t) {
        asyncReplace('aaa', /(\d)/, function() {}, function(err, newString) {
            t.notOk(err, 'should not error');
            t.equal(newString, 'aaa');
            t.end();
        });
    });

    t.test('no match global', function(t) {
        asyncReplace('aaa', /(\d)/g, function() {}, function(err, newString) {
            t.notOk(err, 'should not error');
            t.equal(newString, 'aaa');
            t.end();
        });
    });


    t.test('simple local', function(t) {
        asyncReplace(' foo ', /(fo)(.)/, function(matches, offset, input, callback) {
            t.equal(matches[0], 'foo');
            t.equal(matches[1], 'fo');
            t.equal(matches[2], 'o');
            t.equal(offset, 1);
            t.equal(input, ' foo ');
            process.nextTick(function() {
                callback(null, matches[2] + '-' + matches[1]);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, ' o-fo ');
            t.end();
        });
    });


    t.test('simple global', function(t) {
        asyncReplace(' foo ', /(fo)(.)/g, function(matches, offset, input, callback) {
            t.equal(matches[0], 'foo');
            t.equal(matches[1], 'fo');
            t.equal(matches[2], 'o');
            t.equal(offset, 1);
            t.equal(input, ' foo ');
            process.nextTick(function() {
                callback(null, matches[2] + '-' + matches[1]);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, ' o-fo ');
            t.end();
        });
    });

    t.test('messy global', function(t) {
        var matchexamples = ['foo', 'foz'];
        var offsets = [1, 5];
        var p2s = ['o', 'z'];
        asyncReplace('1foo2foz3', /(fo)(.)/g, function(matches, offset, input, callback) {
            t.equal(matches[0], matchexamples.shift());
            t.equal(matches[1], 'fo');
            t.equal(matches[2], p2s.shift());
            t.equal(offset, offsets.shift());
            t.equal(input, '1foo2foz3');
            process.nextTick(function() {
                callback(null, matches[2].toUpperCase() + matches[1]);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, '1Ofo2Zfo3');
            t.end();
        });
    });

    t.test('global and ignoreCase', function(t) {
        asyncReplace(' Foo foo ', /(f)oo/gi, function(matches, offset, input, callback) {
            process.nextTick(function() {
                callback(null, matches[1]);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, ' F f ');
            t.end();
        });
    });

    t.test('local and ignoreCase', function(t) {
        asyncReplace(' Foo foo ', /(f)oo/i, function(matches, offset, input, callback) {
            process.nextTick(function() {
                callback(null, matches[1]);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, ' F foo ');
            t.end();
        });
    });
    t.end();
});