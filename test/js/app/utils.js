/*
    utils singleton class
*/
"use strict";

var $ = require( 'jquery' );

module.exports = (function() {
    
    var getAllValues = function( selector ){
        
        return $( selector ).map( function( index, element ) {
            return this.innerHTML;
        } ).get().join( '/' );
    }
    
    var getMilliseconds = function ( startDate ) {
        
        var endDate   = new Date();
        var seconds = (endDate.getTime() - startDate.getTime());
        
        return seconds;
    }
    
    var assertHtml = function ( assert, id1, id2 ){
        assert.equal( 
            $( id1 ).text().replace(/\s+/g, ""), 
            $( id2 ).text().replace(/\s+/g, "")
        ); 
    }
    
    var count = function ( selector ){
        return $( selector ).map( function( index, element ) {
            return this.innerHTML;
        } ).get().length;
    }
    
    return {
        getAllValues: getAllValues,
        getMilliseconds: getMilliseconds,
        assertHtml: assertHtml,
        count: count
    };
})();
