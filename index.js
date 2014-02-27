var fs = require('fs');
var path = require('path');

function findModule(dir, filename) {
    var pwd = dir;
    var mod = null;

    do {
        dir = pwd;
        var mdir = path.resolve(pwd, 'modules');

        if ( fs.existsSync( mdir ) && (mod = getModule(mdir, filename)) ) {
            return mod;
        }

        pwd = path.resolve(pwd, '..' );
    } while ( pwd != dir );
}

function getModule (mdir, filename) {
    var mod = null;

    ['', '.js', '.json'].forEach(function(ext) {
        var fpath = path.resolve(mdir, 'modules', filename);
        if (!mod && fs.existsSync(fpath + ext)) {
            mod = require(fpath + ext);
        }
    });
    return mod;
}

/**
 * require modules->node_modules
 * @return {Module}
 */
exports.require = function (name, pwd) {
    var pwd = pwd || __dirname;
    var cwd = process.cwd();

    var mod = findModule(cwd, name);

    if (!mod && cwd != pwd) {
        mod = findModule(pwd, name);
    }

    // 如果寻址失败，从node_modules 中寻找
    if (!mod) {
        mod = require(name);
    }

    return mod;
};