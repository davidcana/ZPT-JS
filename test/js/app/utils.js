/*
    utils singleton class
*/
"use strict";

var $ = require( 'jquery' );
var Qunit = require('qunit');
var htmlComparator = require( './htmlComparator.js' );

module.exports = (function() {
    
    var getAllValues = function( selector ){
        
        return $( selector ).map( function( index, element ) {
            return this.innerHTML;
        } ).get().join( '/' );
    };
    
    var getMilliseconds = function ( startDate ) {
        
        var endDate   = new Date();
        var seconds = (endDate.getTime() - startDate.getTime());
        
        return seconds;
    };
    
    var assertHtml = function ( assert, id, expectedHtml ){
        
        var actualElement = $( id );
        var compare = htmlComparator.compare( 
            actualElement.html(), 
            expectedHtml 
        );
        if ( compare.equals ){
            assert.ok( true );
        } else {
            Qunit.dump.setParser(
                'string',
                function( str ){
                    return str;
                }
            );
            assert.pushResult({
                result: false,
                actual: compare.actual,
                expected: compare.expected,
                message: 'HTML should be equal!',
                negative: false
            });
        }
    };
    /*
    var assertHtml = function ( assert, id, html ){
        assert.equal( 
            $( id ).html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
            html.replace(/(\r\n|\n|\r|\t| )/gm,"")
        );
    };
    */
    /*
    var assertHtml = function ( assert, id1, id2 ){
        assert.equal( 
            $( id1 ).text().replace(/\s+/g, ""), 
            $( id2 ).text().replace(/\s+/g, "")
        ); 
    };
    */
    
    var count = function ( selector ){
        return $( selector ).map( function( index, element ) {
            return this.innerHTML;
        } ).get().length;
    };
    
    return {
        getAllValues: getAllValues,
        getMilliseconds: getMilliseconds,
        assertHtml: assertHtml,
        count: count
    };
})();
