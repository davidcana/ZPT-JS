/* 
    expressionsUtils singleton class
*/
"use strict";

var evaluateHelper = require( './evaluateHelper.js' );
var $ = require( 'jquery' );

module.exports = (function() {
    
    var buildLiteral = function( value ) {
        return evaluateHelper.isNumber( value )? "" + value: "'" + value + "'";
    };
    
    var buildList = function( items, asStrings ) {
        
        var result = '[';
        var separator = asStrings? "'": "";
        
        for ( var i = 0; i < items.length; i++ ) {
            result += separator + items[ i ] + separator + " ";
        }
        
        result += ']';
        return result;
    };
    
    var buildDependsOnList = function(){
        
        var result = [];
        
        for ( var argCounter = 0; argCounter < arguments.length; argCounter++ ){
            var list = arguments[ argCounter ];
            result = result.concat( 
                getDependsOnFromList( list )
            );
        }
        
        return result;
    };
    
    var getDependsOnFromList = function( arg ){
        
        var result = [];
        
        if ( ! arg ){
            return result;
        }
        
        if ( ! $.isArray( arg ) ){
            return getDependsOnFromNonList( arg );
        }
        
        var list = arg;
        for ( var i = 0; i < list.length; i++ ) {
            var item = list[ i ];
            result = result.concat( 
                $.isArray( item )? getDependsOnFromList( item ): getDependsOnFromNonList( item )
            );
        }

        return result;
    };
    
    var getDependsOnFromNonList = function( item ){
        
        if ( $.isFunction( item.dependsOn ) ){
            return item.dependsOn();
        }
        
        throw 'Unable to build depends on list, item does not implement dependsOn method: ' + item;
    };
    
    return {
        buildLiteral: buildLiteral,
        buildList: buildList,
        buildDependsOnList: buildDependsOnList
    };
})();
