//var zz = require( 'zzdom' );
//var Qunit = require( 'qunit' );
//var zpt = require( '../../../js/app/main.js' );
//import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';

QUnit.test( "Defining new vars in dictionary extension tests", function( assert ) {
    
    // First render (not defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11
    };
    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary
    });
    runTests( assert, 11, undefined, NaN );
    
    // Second render (defining var2 in dictionaryExtension)
    var dictionaryExtension = { 
        var2: 22
    };
    zpt.run({
        dictionaryExtension: dictionaryExtension
    });
    runTests( assert, 11, 22, 33 );
    
    // Third render (not using dictionaryExtension)
    zpt.run();
    runTests( assert, 11, undefined, NaN );
    
});

QUnit.test( "Redefining vars in dictionary extension tests", function( assert ) {
    
    // First render (defining var2, not using dictionaryExtension)
    var dictionary = { 
        var1: 11,
        var2: 2
    };
    zpt.run({
        root: document.getElementById( 't1' ),
        dictionary: dictionary
    });
    runTests( assert, 11, 2, 13 );
    
    // Second render (redefining var2 in dictionaryExtension)
    var dictionaryExtension = { 
        var2: 22
    };
    zpt.run({
        dictionaryExtension: dictionaryExtension
    });
    runTests( assert, 11, 22, 33 );
    
    // Third render (not using dictionaryExtension)
    zpt.run();
    runTests( assert, 11, 2, 13 );

});

var runTests = function( assert ){
    assert.equal( zz('#t1-1').html() , '' + arguments[ 1 ] );
    assert.equal( zz('#t1-2').html() , '' + arguments[ 2 ] );
    assert.equal( zz('#t1-3').html() , '' + arguments[ 3 ] );
}
