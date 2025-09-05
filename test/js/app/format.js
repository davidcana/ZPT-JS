//var zz = require( 'zzdom' );
//var zpt = require( '../../../js/app/main.js' );
//var dictionary = require( './dictionary.js' );
//var Qunit = require( 'qunit' );
//import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { dictionary } from './dictionary.js';

QUnit.test( "Simple format test", function( assert ) {
    
    zpt.run({
        root: document.getElementById( 'group1' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t1-1').html() , "test" );
    assert.equal( zz('#t1-2').html() , "TEST" );
    assert.equal( zz('#t1-3').html() , "variable test" );
    assert.equal( zz('#t1-4').html() , "VARIABLE TEST" );
});

QUnit.test( "Format with arguments test", function( assert ) {
    
    zpt.run({
        root: document.getElementById( 'group2' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t2-1').html() , "1.38" );
    assert.equal( zz('#t2-2').html() , "1.6" );
    assert.equal( zz('#t2-3').html() , "0.33" );
});

QUnit.test( "Custom formatters using dictionary test", function( assert ) {
    
    assert.equal( zpt.context.getFormatter( 'customFormatter' ), undefined );
    assert.equal( dictionary.customFormatter, undefined );
    
    dictionary.customFormatter = function( value ){
        return "$" + value;
    };
    
    zpt.run({
        root: document.getElementById( 'group3' ),
        dictionary: dictionary
    });
    
    assert.equal( zz('#t3-1').html() , "$150" );
    assert.equal( zz('#t3-2').html() , "$225" );
    assert.equal( zz('#t3-3').html() , "$1225" );
    
    delete dictionary.customFormatter;
    
    assert.equal( zpt.context.getFormatter( 'customFormatter' ), undefined );
    assert.equal( dictionary.customFormatter, undefined );
});

QUnit.test( "Custom formatters registering in context test", function( assert ) {
    
    assert.equal( zpt.context.getFormatter( 'customFormatter' ), undefined );
    assert.equal( dictionary.customFormatter, undefined );
    
    zpt.context.registerFormatter( 
        'customFormatter', 
        function( value ){
            return value + "€";
        }
    );
    
    zpt.run({
        root: document.getElementById( 'group3' ),
        dictionary: dictionary
    });

    assert.equal( zz('#t3-1').html() , "150€" );
    assert.equal( zz('#t3-2').html() , "225€" );
    assert.equal( zz('#t3-3').html() , "1225€" );
    
    zpt.context.unregisterFormatter( 'customFormatter' );
    
    assert.equal( zpt.context.getFormatter( 'customFormatter' ), undefined );
    assert.equal( dictionary.customFormatter, undefined );
});
