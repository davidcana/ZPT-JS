//var zz = require( 'zzdom' );
//var zpt = require( '../../../js/app/main.js' );
//var dictionary = require( './dictionary.js' );
//var Qunit = require( 'qunit' );
//var context = require( '../../../js/app/context.js' );
import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { dictionary } from './dictionary.js';

var errorFunction = function( errors ) {
    throw errors;
};
zpt.context.setErrorFunction( errorFunction );

// Unit tests
QUnit.test( "Non existing expressions test", function( assert ) {

    try {
        zpt.run({
            root: zz( '#t1' )[0],
            dictionary: dictionary
        });
    } catch ( e ) {
        assert.equal( e , "Unknown expression: strinnnng:" );
    }
    
    assert.equal( zz('#t1-1').html() , "not defined expression" );
    assert.equal( zz('#t1-2').html() , "not defined expression" );
});

QUnit.test( "Using null values in expressions test", function( assert ) {

    try {
        zpt.run({
            root: zz( '#t2' )[0],
            dictionary: dictionary
        });
    } catch( e ){
        assert.equal( e , "Error trying doing math operation, value 'null' is not a valid number in expression 'add nullValue'" );
    }
});

QUnit.test( "Using null values in path expressions test", function( assert ) {

    try {
        zpt.run({
            root: zz( '#t3' )[0],
            dictionary: dictionary
        });
    } catch( e ){
        assert.equal( e , "Error evaluating \"nullValue/noWay\": \"nullValue\" is null" );
    }
});

QUnit.test( "External macro in non-existing file test", function( assert ) {
    
    var done = assert.async();
    
    zpt.run({
        command: 'preload',
        root: document.body,
        dictionary: {},
        declaredRemotePageUrls: [],
        callback: function(){
            assert.equal( 0, 1, "Found external file, but it is an error!" );
            done();
        },
        failCallback: function( msg ){
            assert.equal( msg, "Error trying to get notFoundFile.html: Not Found" );
            done();
        }
    });
});

QUnit.test( "Non-existing i18n file test", function( assert ) {

    var done = assert.async();

    zpt.run({
        command: 'preload',
        root: document.body,
        dictionary: {},
        declaredRemotePageUrls: [],
        i18n: {
            urlPrefix: './i18n/',
            files: {
                'es': [ 'es1.json', 'es_notFound.json' ],
                'en': [ 'en1.json', 'en2.json' ]
            }
        },
        callback: function(){
            assert.equal( 0, 1, "Found external file, but it is an error!" );
            done();
        },
        failCallback: function( msg ){
            assert.equal( msg, "Error trying to get ./i18n/es_notFound.json: Not Found" );
            done();
        }
    });
});

QUnit.test( "Using null root test", function( assert ) {

    try {
        zpt.run({
            root: document.getElementById( 'nonExistentId' ),
            dictionary: dictionary
        });
    } catch( e ){
        assert.equal( e , "Unable to process null root or target!" );
    }
});

QUnit.test( "Using null target test", function( assert ) {

    zpt.run({
        root: zz( '#t5' )[0],
        dictionary: dictionary
    });
    
    assert.equal( zz('#t5-1').html() , "3" );
    
    try {
        zpt.run({
            command: 'partialRender',
            target: document.getElementById( 'nonExistentId' )
        });
        assert.equal( "true" , "false" );
        
    } catch( e ){
        assert.equal( e , "Unable to process null root or target!" );
    }
});

QUnit.test( "Using undefined expression in path expression test", function( assert ) {

    try {
        zpt.run({
            root: zz( '#t6' )[0],
            dictionary: dictionary
        });
    } catch( e ){
        assert.equal( e , "Null token inside path expression: 'a' || 'b'" );
    }
});
