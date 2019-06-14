/* 
    Class Loop 
*/
"use strict";

var AutoDefineHelper = require( './autoDefineHelper.js' );
var expressionBuilder = require( '../expressions/expressionBuilder.js' );

module.exports = function ( _itemVariableName, _expressionString, scope ) {
    
    var itemVariableName = _itemVariableName;
    var expressionString = _expressionString;
    
    var expression = expressionBuilder.build( expressionString );
    var getExpression = function(){
        return expression;
    };
    
    var items = expression.evaluate( scope );
    var getItems = function(){
        return items;
    };
    
    var currentIndex = -1;
    var maxIndex = items? items.length - 1: -1;
    
    var offset = 0;
    var setOffset = function( _offset ){
        offset = _offset;
    };
    
    var repeat = function(){
        
        if ( currentIndex++ < maxIndex ) {
            
            var autoDefineHelper = new AutoDefineHelper();
            
            // Declare item-index, item-all, item and item-repeat variables
            autoDefineHelper.put(
                itemVariableName + '-index',
                currentIndex
            );
            autoDefineHelper.put(
                itemVariableName + '-all',
                expressionString
            );
            autoDefineHelper.put(
                itemVariableName,
                itemVariableName + '-all' + '[' + itemVariableName + '-index' + ']'
            );
            autoDefineHelper.put(
                itemVariableName + '-repeat',
                "context/repeat(" 
                    + itemVariableName + "-index" + ","
                    + items.length + ","
                    + offset
                    + ")"
            );
            
            return autoDefineHelper;
        }
        
        return null;
    };
    
    return {
        setOffset: setOffset,
        repeat:repeat,
        getItems: getItems,
        getExpression: getExpression
    };
};
