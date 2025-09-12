
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { dictionary } from './dictionary.js';

var errorsCounter = 0;
var errorFunction = function( errors ) {
    ++errorsCounter;
};
zpt.context.setErrorFunction( errorFunction );

// Run tests!
QUnit.test( "Before on-error tag test", function( assert ) {
    
    try {
        errorsCounter = 0;
        zpt.run({
            root: zz( '#group1' )[0],
            dictionary: dictionary
        });
    } catch( e ) {
        // Nothing to do
    }
    assert.equal( 1, errorsCounter );
    assert.equal( zz('#t1-1').text() , "false" );
});

QUnit.test( "on-error tag test", function( assert ) {
    
    zpt.run({
        root: zz( '#group2' )[0],
        dictionary: dictionary
    });
    
    assert.equal( zz('#t2-1').text() , "true" );
    assert.equal( zz('#t2-2').text() , "1" );
    assert.equal( zz('#t2-3').text() , "Oh, noooo!" );
    assert.equal( zz('#t2-4').text() , "yes" );
    assert.equal( zz('#t2-5').text() , "Infinity" );
});

QUnit.test( "After on-error tag test", function( assert ) {

    try {
        errorsCounter = 0;
        zpt.run({
            root: zz( '#group3' )[0],
            dictionary: dictionary
        });
    } catch( e ) {
        // Nothing to do
    }
    
    assert.equal( 1, errorsCounter );
    assert.equal( zz('#t3-1').text() , "false" );
});

QUnit.test( "on-error object tag test", function( assert ) {
    
    dictionary.treatError = function( error ){
        return error.type + '/' + error.value + '/' + error.traceback.substring( 0, 44 );
    };
    
    zpt.run({
        root: zz( '#group4' )[0],
        dictionary: dictionary
    });

    //assert.equal( zz('#t4-1').text() , "true" );
    assert.equal( zz('#t4-2').text() , "1" );
    //assert.ok(
    //    zz('#t4-3').text() == "TypeError/Cannot set property 'innerHTML' of null/TypeError: Cannot set property 'innerHTML' o"
    //    || zz('#t4-3').text() == "TypeError/document.getElementById(...) is null/fireError@http://127.0.0.1:9966/on-error.js:"
    //);
    assert.ok( 
        zz('#t4-3').text().startsWith( "TypeError/Cannot set properties of null (setting 'innerHTML')/TypeError" )
    );
    assert.equal( zz('#t4-4').text() , "yes" );
    assert.equal( zz('#t4-5').text() , "Infinity" );
});

QUnit.test( "on-error nothing test", function( assert ) {

    zpt.run({
        root: zz( '#group5' )[0],
        dictionary: dictionary
    });

    assert.equal( zz('#t5-1').text() , "" );
});

QUnit.test( "on-error literal structure test", function( assert ) {
    
    zpt.run({
        root: zz( '#group6' )[0],
        dictionary: dictionary
    });

    assert.equal( zz('#t6-1').html() , "&lt;strong&gt;Oh, noooo!&lt;/strong&gt;" );
    
    zpt.run({
        root: zz( '#group7' )[0],
        dictionary: dictionary
    });

    assert.equal( zz('#t7-1').html() , "<strong>Oh, noooo!</strong>" );
});

