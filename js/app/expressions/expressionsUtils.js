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
        
        var selfVarName = arguments[ 0 ];
        var scope = arguments[ 1 ];
        
        for ( var argCounter = 2; argCounter < arguments.length; argCounter++ ){
            var list = arguments[ argCounter ];
            result = result.concat( 
                getDependsOnFromList( selfVarName, scope, list )
            );
        }
        
        return result;
    };
    
    var getDependsOnFromList = function( selfVarName, scope, arg ){
        
        var result = [];
        
        if ( ! arg ){
            return result;
        }
        
        if ( ! $.isArray( arg ) ){
            return getDependsOnFromNonList( selfVarName, scope, arg );
        }
        
        var list = arg;
        for ( var i = 0; i < list.length; i++ ) {
            var item = list[ i ];
            result = result.concat( 
                $.isArray( item )? getDependsOnFromList( scope, item ): getDependsOnFromNonList( selfVarName, scope, item )
            );
        }

        return result;
    };
    
    var getDependsOnFromNonList = function( selfVarName, scope, item ){
        
        return ! $.isFunction( item.dependsOn ) || ( $.isFunction( item.getVarName ) && selfVarName === item.getVarName() )? 
            []: 
            item.dependsOn( selfVarName, scope );
        //return $.isFunction( item.dependsOn )? item.dependsOn( scope ): [];
    };
    
    return {
        buildLiteral: buildLiteral,
        buildList: buildList,
        buildDependsOnList: buildDependsOnList
    };
})();
