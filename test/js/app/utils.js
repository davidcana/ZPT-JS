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
    
    return {
        getAllValues: getAllValues,
        getMilliseconds: getMilliseconds
    };
})();
