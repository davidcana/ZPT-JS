"use strict";

var $ = require( 'jquery' );
var zpt = require( '../../../js/app/main.js' );
var dictionary = require( './dictionary.js' );
var Qunit = require( 'qunit' );

// Parse template
zpt.run({
    root: document.body,
    dictionary: dictionary
});

// Run tests
QUnit.test( "loop test", function( assert ) {
    assert.equal( getAllValues( '.value' ) , 'tool A/tool B/tool C/tool D'  );
    assert.equal( getAllValues( '.index' ) , '0/1/2/3'  );
    assert.equal( getAllValues( '.number' ) , '1/2/3/4'  );
    assert.equal( getAllValues( '.isEven' ) , 'true/false/true/false'  );
    assert.equal( getAllValues( '.isOdd' ) , 'false/true/false/true'  );
    assert.equal( getAllValues( '.isStart' ) , 'true/false/false/false'  );
    assert.equal( getAllValues( '.isEnd' ) , 'false/false/false/true'  );
    assert.equal( getAllValues( '.getLength' ) , '4/4/4/4'  );
    assert.equal( getAllValues( '.getLetter' ) , 'a/b/c/d'  );
    assert.equal( getAllValues( '.getCapitalLetter' ) , 'A/B/C/D'  );
    assert.equal( getAllValues( '.getRoman' ) , 'i/ii/iii/iv'  );
    assert.equal( getAllValues( '.getCapitalRoman' ) , 'I/II/III/IV'  );
});

QUnit.test( "array loops test", function( assert ) {
    assert.equal( getAllValues( '.cValue1' ) , '10/20/30' );
    assert.equal( getAllValues( '.cValue2' ) , 'jaja/jeje/jiji' );
    assert.equal( getAllValues( '.cValue3' ) , 'jaja/100/2' );
    assert.equal( getAllValues( '.cValue4' ) , 'jaja/100/5' );
    assert.equal( getAllValues( '.cValue5' ) , '1/2/3/4/5' );
    assert.equal( getAllValues( '.cValue6' ) , '1/3/5/7' );
    assert.equal( getAllValues( '.cValue7' ) , '7/5/3/1' );
    assert.equal( getAllValues( '.cValue8' ) , '0/1/2/3/4/5'  );
    assert.equal( getAllValues( '.cValue9' ) , '2/4/6/8'  );
    assert.equal( getAllValues( '.cValue10' ) , 'jaja/0/1/2/jeje'  );
    assert.equal( getAllValues( '.cValue11' ) , ''  );
    assert.equal( getAllValues( '.cValue12' ) , ''  );
    assert.equal( getAllValues( '.cValue13' ) , ''  );
});

QUnit.test( "dynamic loops test", function( assert ) {
    //assert.equal( getAllValues( '.nValue1' ) , '10/20/30/40' );
    
    // Replace 10/20/30/40 by 10/20/30
    var dictionary = {
            someNumbers: [ 10, 20, 30 ]
    };
    zpt.run({
        root: $( '#dynamicLoop' )[0],
        dictionary: dictionary
    });
    assert.equal( getAllValues( '.nValue1' ) , '10/20/30' );
    
    // Add 40/50/60
    var dictionary = {
            someNumbers: [ 40, 50, 60 ]
    };
    
    zpt.run({
        root: $( '#dynamicLoop' )[0],
        dictionary: dictionary,
        notRemoveGeneratedTags: true
    });
    assert.equal( getAllValues( '.nValue1' ) , '10/20/30/40/50/60' );
});

QUnit.test( "array loops test", function( assert ) {
    assert.equal( getAllValues( '.pValue' ) , '1/2/3/4/5' );
    //assert.equal( getAllValues( '.pValue' ) , '1/5/2/3/4' );
});

QUnit.test( "dynamic loops in table test", function( assert ) {
    
    assert.equal( getAllValues( '.d_value' ) , 'tool A/tool B/tool C/tool D'  );
    assert.equal( getAllValues( '.d_index' ) , '0/1/2/3'  );
    assert.equal( getAllValues( '.d_number' ) , '1/2/3/4'  );
    assert.equal( getAllValues( '.d_isEven' ) , 'true/false/true/false'  );
    assert.equal( getAllValues( '.d_isOdd' ) , 'false/true/false/true'  );
    assert.equal( getAllValues( '.d_isStart' ) , 'true/false/false/false'  );
    assert.equal( getAllValues( '.d_isEnd' ) , 'false/false/false/true'  );
    assert.equal( getAllValues( '.d_getLength' ) , '4/4/4/4'  );
    assert.equal( getAllValues( '.d_getLetter' ) , 'a/b/c/d'  );
    assert.equal( getAllValues( '.d_getCapitalLetter' ) , 'A/B/C/D'  );
    assert.equal( getAllValues( '.d_getRoman' ) , 'i/ii/iii/iv'  );
    assert.equal( getAllValues( '.d_getCapitalRoman' ) , 'I/II/III/IV'  );

    // Add a tool
    var dictionary = {
        tools: []
    };
    dictionary.tools.push( 
        { name: "tool E", rent_url: "rent?id=1008" } );
    
    zpt.run({
        root: $( '#dynamicLoop2' )[0],
        dictionary: dictionary,
        notRemoveGeneratedTags: true
    });
    
    assert.equal( getAllValues( '.d_value' ) , 'tool A/tool B/tool C/tool D/tool E'  );
    assert.equal( getAllValues( '.d_index' ) , '0/1/2/3/4'  );
    assert.equal( getAllValues( '.d_number' ) , '1/2/3/4/5'  );
    assert.equal( getAllValues( '.d_isEven' ) , 'true/false/true/false/true'  );
    assert.equal( getAllValues( '.d_isOdd' ) , 'false/true/false/true/false'  );
    assert.equal( getAllValues( '.d_isStart' ) , 'true/false/false/false/false'  );
    assert.equal( getAllValues( '.d_isEnd' ) , 'false/false/false/true/true'  );
    assert.equal( getAllValues( '.d_getLength' ) , '4/4/4/4/5'  );
    assert.equal( getAllValues( '.d_getLetter' ) , 'a/b/c/d/e'  );
    assert.equal( getAllValues( '.d_getCapitalLetter' ) , 'A/B/C/D/E'  );
    assert.equal( getAllValues( '.d_getRoman' ) , 'i/ii/iii/iv/v'  );
    assert.equal( getAllValues( '.d_getCapitalRoman' ) , 'I/II/III/IV/V'  );
    
    // Add a tool
    var dictionary = {
        tools: []
    };
    dictionary.tools.push( 
        { name: "tool F", rent_url: "rent?id=1010" } );
    dictionary.tools.push( 
        { name: "tool G", rent_url: "rent?id=1012" } );
    
    zpt.run({
        root: $( '#dynamicLoop2' )[0],
        dictionary: dictionary,
        notRemoveGeneratedTags: true
    });
    
    assert.equal( getAllValues( '.d_value' ) , 'tool A/tool B/tool C/tool D/tool E/tool F/tool G'  );
    assert.equal( getAllValues( '.d_index' ) , '0/1/2/3/4/5/6'  );
    assert.equal( getAllValues( '.d_number' ) , '1/2/3/4/5/6/7'  );
    assert.equal( getAllValues( '.d_isEven' ) , 'true/false/true/false/true/false/true'  );
    assert.equal( getAllValues( '.d_isOdd' ) , 'false/true/false/true/false/true/false'  );
    assert.equal( getAllValues( '.d_isStart' ) , 'true/false/false/false/false/false/false'  );
    assert.equal( getAllValues( '.d_isEnd' ) , 'false/false/false/true/true/false/true'  );
    assert.equal( getAllValues( '.d_getLength' ) , '4/4/4/4/5/7/7'  );
    assert.equal( getAllValues( '.d_getLetter' ) , 'a/b/c/d/e/f/g'  );
    assert.equal( getAllValues( '.d_getCapitalLetter' ) , 'A/B/C/D/E/F/G'  );
    assert.equal( getAllValues( '.d_getRoman' ) , 'i/ii/iii/iv/v/vi/vii'  );
    assert.equal( getAllValues( '.d_getCapitalRoman' ) , 'I/II/III/IV/V/VI/VII'  );
});

/*
function getValues( selector ){
    return $( selector ).map( function( index, element ) {
        return this.innerHTML;
    } ).get().slice( 1 ).join( '/' );
}*/
function getAllValues( selector ){
    return $( selector ).map( function( index, element ) {
        return this.innerHTML;
    } ).get().join( '/' );
}
