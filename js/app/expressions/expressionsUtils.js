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
    
    var getDependsOnFromList = function( list ){
        
        var result = [];
        
        if ( ! list ){
            return result;
        }
        
        for ( var i = 0; i < list.length; i++ ) {
            var item = list[ i ];
            result = result.concat( 
                $.isArray( item )? getDependsOnFromList( item ): item.dependsOn()
            );
        }

        return result;
    };
    /*
    var buildDependsOnList = function( expressionList ){

        var result = [];
        for ( var i = 0; i < expressionList.length; i++ ) {
            result = result.concat( expressionList[ i ].dependsOn() )
        }
        return result;
    };
    */
    
    return {
        buildLiteral: buildLiteral,
        buildList: buildList,
        buildDependsOnList: buildDependsOnList
    };
})();
