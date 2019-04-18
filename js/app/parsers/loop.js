/* 
    Class Loop 
*/
"use strict";

var TalDefineHelper = require( './talDefineHelper.js' );
var expressionBuilder = require( '../expressions/expressionBuilder.js' );

module.exports = function ( _itemVariableName, _expressionString, scope ) {
    
    var itemVariableName = _itemVariableName;
    var expressionString = _expressionString;
    var expression = expressionBuilder.build( expressionString );
    var items = expression.evaluate( scope );
    
    var currentIndex = -1;
    var maxIndex = items? items.length - 1: -1;
    var offset = 0;
    
    var setOffset = function( _offset ){
        offset = _offset;
    };
    
    var repeat = function(){
        
        if ( currentIndex++ < maxIndex ) {
            
            var talDefineHelper = new TalDefineHelper();
            
            // Declare item-index, item-all, item and item-repeat variables
            talDefineHelper.put(
                itemVariableName + '-index',
                currentIndex
            );
            talDefineHelper.put(
                itemVariableName + '-all',
                expressionString
            );
            talDefineHelper.put(
                itemVariableName,
                itemVariableName + '-all' + '[' + itemVariableName + '-index' + ']'
            );
            talDefineHelper.put(
                itemVariableName + '-repeat',
                "context/repeat(" 
                    + itemVariableName + "-index" + ","
                    + items.length + ","
                    + offset
                    + ")"
            );
            
            return talDefineHelper;
        }
        
        return null;
    };

    return {
        setOffset: setOffset,
        repeat:repeat
    };
};
