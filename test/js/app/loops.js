//var zz = require( 'zzdom' );
//var zpt = require( '../../../js/app/main.js' );
//var dictionary = require( './dictionary.js' );
//var Qunit = require( 'qunit' );
//var utils = require( './utils.js' );
//import QUnit from '../../../lib/qunit-esm.js';
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { dictionary } from './dictionary.js';
import { utils } from './utils.js';

// Add vars to dictionary
dictionary.emptyArray = [];

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests
QUnit.test( "loop test", function( assert ) {
    assert.equal( utils.getAllValues( '.value' ) , 'tool A/tool B/tool C/tool D'  );
    assert.equal( utils.getAllValues( '.index' ) , '0/1/2/3'  );
    assert.equal( utils.getAllValues( '.number' ) , '1/2/3/4'  );
    assert.equal( utils.getAllValues( '.isEven' ) , 'true/false/true/false'  );
    assert.equal( utils.getAllValues( '.isOdd' ) , 'false/true/false/true'  );
    assert.equal( utils.getAllValues( '.isStart' ) , 'true/false/false/false'  );
    assert.equal( utils.getAllValues( '.isEnd' ) , 'false/false/false/true'  );
    assert.equal( utils.getAllValues( '.getLength' ) , '4/4/4/4'  );
    assert.equal( utils.getAllValues( '.getLetter' ) , 'a/b/c/d'  );
    assert.equal( utils.getAllValues( '.getCapitalLetter' ) , 'A/B/C/D'  );
    assert.equal( utils.getAllValues( '.getRoman' ) , 'i/ii/iii/iv'  );
    assert.equal( utils.getAllValues( '.getCapitalRoman' ) , 'I/II/III/IV'  );
});

QUnit.test( "array loops test", function( assert ) {
    assert.equal( utils.getAllValues( '.cValue1' ) , '10/20/30' );
    assert.equal( utils.getAllValues( '.cValue2' ) , 'jaja/jeje/jiji' );
    assert.equal( utils.getAllValues( '.cValue3' ) , 'jaja/100/2' );
    assert.equal( utils.getAllValues( '.cValue4' ) , 'jaja/100/5' );
    assert.equal( utils.getAllValues( '.cValue5' ) , '1/2/3/4/5' );
    assert.equal( utils.getAllValues( '.cValue6' ) , '1/3/5/7' );
    assert.equal( utils.getAllValues( '.cValue7' ) , '7/5/3/1' );
    assert.equal( utils.getAllValues( '.cValue8' ) , '0/1/2/3/4/5'  );
    assert.equal( utils.getAllValues( '.cValue9' ) , '2/4/6/8'  );
    assert.equal( utils.getAllValues( '.cValue10' ) , 'jaja/0/1/2/jeje'  );
    assert.equal( utils.getAllValues( '.cValue11' ) , ''  );
    assert.equal( utils.getAllValues( '.cValue12' ) , ''  );
    assert.equal( utils.getAllValues( '.cValue13' ) , ''  );
});

QUnit.test( "dynamic loops test", function( assert ) {
    
    // Replace 10/20/30/40 by 10/20/30
    dictionary.someNumbers = [ 10, 20, 30 ];
    zpt.run({
        root: zz( '#dynamicLoop' )[0]
    });
    assert.equal( utils.getAllValues( '.nValue1' ) , '10/20/30' );
    
    // Add 40/50/60
    dictionary.someNumbers = [ 40, 50, 60 ];
    
    zpt.run({
        notRemoveGeneratedTags: true
    });
    assert.equal( utils.getAllValues( '.nValue1' ) , '10/20/30/40/50/60' );
});

QUnit.test( "array loops test", function( assert ) {
    assert.equal( utils.getAllValues( '.pValue' ) , '1/2/3/4/5' );
});

QUnit.test( "dynamic loops in table test", function( assert ) {
    
    assert.equal( utils.getAllValues( '.d_value' ) , 'tool A/tool B/tool C/tool D'  );
    assert.equal( utils.getAllValues( '.d_index' ) , '0/1/2/3'  );
    assert.equal( utils.getAllValues( '.d_number' ) , '1/2/3/4'  );
    assert.equal( utils.getAllValues( '.d_isEven' ) , 'true/false/true/false'  );
    assert.equal( utils.getAllValues( '.d_isOdd' ) , 'false/true/false/true'  );
    assert.equal( utils.getAllValues( '.d_isStart' ) , 'true/false/false/false'  );
    assert.equal( utils.getAllValues( '.d_isEnd' ) , 'false/false/false/true'  );
    assert.equal( utils.getAllValues( '.d_getLength' ) , '4/4/4/4'  );
    assert.equal( utils.getAllValues( '.d_getLetter' ) , 'a/b/c/d'  );
    assert.equal( utils.getAllValues( '.d_getCapitalLetter' ) , 'A/B/C/D'  );
    assert.equal( utils.getAllValues( '.d_getRoman' ) , 'i/ii/iii/iv'  );
    assert.equal( utils.getAllValues( '.d_getCapitalRoman' ) , 'I/II/III/IV'  );

    // Add a tool
    dictionary.tools = [
        { 
            name: "tool E", 
            rent_url: "rent?id=1008" 
        }
    ];
    
    zpt.run({
        root: zz( '#dynamicLoop2' )[0],
        notRemoveGeneratedTags: true
    });
    
    assert.equal( utils.getAllValues( '.d_value' ) , 'tool A/tool B/tool C/tool D/tool E'  );
    assert.equal( utils.getAllValues( '.d_index' ) , '0/1/2/3/4'  );
    assert.equal( utils.getAllValues( '.d_number' ) , '1/2/3/4/5'  );
    assert.equal( utils.getAllValues( '.d_isEven' ) , 'true/false/true/false/true'  );
    assert.equal( utils.getAllValues( '.d_isOdd' ) , 'false/true/false/true/false'  );
    assert.equal( utils.getAllValues( '.d_isStart' ) , 'true/false/false/false/false'  );
    assert.equal( utils.getAllValues( '.d_isEnd' ) , 'false/false/false/true/true'  );
    assert.equal( utils.getAllValues( '.d_getLength' ) , '4/4/4/4/5'  );
    assert.equal( utils.getAllValues( '.d_getLetter' ) , 'a/b/c/d/e'  );
    assert.equal( utils.getAllValues( '.d_getCapitalLetter' ) , 'A/B/C/D/E'  );
    assert.equal( utils.getAllValues( '.d_getRoman' ) , 'i/ii/iii/iv/v'  );
    assert.equal( utils.getAllValues( '.d_getCapitalRoman' ) , 'I/II/III/IV/V'  );
    
    // Add 2 tools
    dictionary.tools = [
        { 
            name: "tool F", 
            rent_url: "rent?id=1010"
        },
        { 
            name: "tool G",
            rent_url: "rent?id=1012"
        }
    ];
    zpt.run({
        notRemoveGeneratedTags: true
    });
    
    assert.equal( utils.getAllValues( '.d_value' ) , 'tool A/tool B/tool C/tool D/tool E/tool F/tool G'  );
    assert.equal( utils.getAllValues( '.d_index' ) , '0/1/2/3/4/5/6'  );
    assert.equal( utils.getAllValues( '.d_number' ) , '1/2/3/4/5/6/7'  );
    assert.equal( utils.getAllValues( '.d_isEven' ) , 'true/false/true/false/true/false/true'  );
    assert.equal( utils.getAllValues( '.d_isOdd' ) , 'false/true/false/true/false/true/false'  );
    assert.equal( utils.getAllValues( '.d_isStart' ) , 'true/false/false/false/false/false/false'  );
    assert.equal( utils.getAllValues( '.d_isEnd' ) , 'false/false/false/true/true/false/true'  );
    assert.equal( utils.getAllValues( '.d_getLength' ) , '4/4/4/4/5/7/7'  );
    assert.equal( utils.getAllValues( '.d_getLetter' ) , 'a/b/c/d/e/f/g'  );
    assert.equal( utils.getAllValues( '.d_getCapitalLetter' ) , 'A/B/C/D/E/F/G'  );
    assert.equal( utils.getAllValues( '.d_getRoman' ) , 'i/ii/iii/iv/v/vi/vii'  );
    assert.equal( utils.getAllValues( '.d_getCapitalRoman' ) , 'I/II/III/IV/V/VI/VII'  );
});

QUnit.test( "default loop test", function( assert ) {
    assert.equal( utils.getAllValues( '.lValue' ) , 'Default item' );
});

QUnit.test( "empty loop test", function( assert ) {
    assert.equal( utils.getAllValues( '.eValue' ) , 'First item' );
});
