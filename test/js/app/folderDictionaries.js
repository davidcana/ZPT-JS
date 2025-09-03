//var zz = require( 'zzdom' );
//var Qunit = require( 'qunit' );
//var zpt = require( '../../../js/app/main.js' );
//var utils = require( './utils.js' );
import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';

QUnit.test( "1 level of folder dictionaries tests", function( assert ) {
    
    var done = assert.async();
    
    // First render (not defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11
    };
    zpt.run({
        command: 'preload',
        root: document.getElementById( 't1' ),
        dictionary: dictionary,
        maxFolderDictionaries: 5,
        callback: function(){

            // Run ZPT
            zpt.run();
            runTests( assert, 11, 111, undefined, undefined );
            
            done();
        }
    });
});

QUnit.test( "1 level of folder dictionaries with dictionaryExtension tests", function( assert ) {

    var done = assert.async();

    // First render (not defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11
    };
    zpt.run({
        command: 'preload',
        root: document.getElementById( 't1' ),
        dictionary: dictionary,
        maxFolderDictionaries: 5,
        callback: function(){

            // Run ZPT
            zpt.run();
            runTests( assert, 11, 111, undefined, undefined );

            // Second render (defining folderVar1 in dictionaryExtension)
            var dictionaryExtension = { 
                folderVar1: 123
            };
            zpt.run({
                dictionaryExtension: dictionaryExtension
            });
            runTests( assert, 11, 123, undefined, undefined );

            // Third render (not using dictionaryExtension)
            zpt.run();
            runTests( assert, 11, 111, undefined, undefined );

            done();
        }
    });
});

QUnit.test( "1 level of folder dictionaries with dictionary tests", function( assert ) {

    var done = assert.async();

    // First render (not defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11
    };
    zpt.run({
        command: 'preload',
        root: document.getElementById( 't1' ),
        dictionary: dictionary,
        maxFolderDictionaries: 5,
        callback: function(){

            // Run ZPT
            zpt.run();
            runTests( assert, 11, 111, undefined, undefined );

            // Second render (defining folderVar1 in dictionary)
            dictionary.folderVar1 = 123;
            zpt.run();
            runTests( assert, 11, 123, undefined, undefined );

            // Third render (deleting folderVar1 in dictionary)
            delete dictionary.folderVar1;
            zpt.run();
            runTests( assert, 11, 111, undefined, undefined );

            done();
        }
    });
});

var runTests = function( assert ){
    assert.equal( zz('#t1-1').html() , '' + arguments[ 1 ] );
    assert.equal( zz('#t1-2').html() , '' + arguments[ 2 ] );
    assert.equal( zz('#t1-3').html() , '' + arguments[ 3 ] );
    assert.equal( zz('#t1-4').html() , '' + arguments[ 4 ] );
}
