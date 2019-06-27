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
        
        var scope = arguments[ 0 ]
        
        for ( var argCounter = 1; argCounter < arguments.length; argCounter++ ){
            var list = arguments[ argCounter ];
            result = result.concat( 
                getDependsOnFromList( scope, list )
            );
        }
        
        return result;
    };
    
    var getDependsOnFromList = function( scope, arg ){
        
        var result = [];
        
        if ( ! arg ){
            return result;
        }
        
        if ( ! $.isArray( arg ) ){
            return getDependsOnFromNonList( scope, arg );
        }
        
        var list = arg;
        for ( var i = 0; i < list.length; i++ ) {
            var item = list[ i ];
            result = result.concat( 
                $.isArray( item )? getDependsOnFromList( scope, item ): getDependsOnFromNonList( scope, item )
            );
        }

        return result;
    };
    
    var getDependsOnFromNonList = function( scope, item ){
        
        if ( $.isFunction( item.dependsOn ) ){
            return item.dependsOn( scope );
        }
        
        throw 'Unable to build depends on list, item does not implement dependsOn method: ' + item;
    };
    
    return {
        buildLiteral: buildLiteral,
        buildList: buildList,
        buildDependsOnList: buildDependsOnList
    };
})();
