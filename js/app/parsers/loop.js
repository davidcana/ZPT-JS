/* 
    Class Loop 
*/
//var AutoDefineHelper = require( './autoDefineHelper.js' );
//var expressionBuilder = require( '../expressions/expressionBuilder.js' );
//var context = require( '../context.js' );
import { context } from '../context.js';
import { AutoDefineHelper } from './autoDefineHelper.js';
import { expressionBuilder } from '../expressions/expressionBuilder.js';

export const Loop = function ( _itemVariableName, _expressionString, scope ) {
    
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
            
            return Loop.buildAutoDefineHelper( 
                itemVariableName, 
                currentIndex, 
                expressionString, 
                items.length, 
                offset 
            );
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

Loop.buildAutoDefineHelper = function( itemVariableName, itemIndex, expressionString, numberOfItems, offset ){
    
    var autoDefineHelper = new AutoDefineHelper();

    // Declare item-index, item-all, item and item-repeat variables
    autoDefineHelper.put(
        itemVariableName + '-index',
        itemIndex
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
            + numberOfItems + ","
            + offset
            + ")"
    );

    return autoDefineHelper;
};

Loop.setAutoDefineAttribute = function( node, itemVariableName, itemIndex, expressionString, numberOfItems, offset ){
    
    // Set item-index, item-all, item and item-repeat attributes
    node.setAttribute( 
        context.getTags().talAutoDefine,
        itemVariableName + '-index ' + itemIndex + ';'
            + itemVariableName + '-all ' + expressionString + ';'
            + itemVariableName + ' ' + itemVariableName +'-all[' + itemVariableName + '-index];'
            + itemVariableName + '-repeat context/repeat(' + itemVariableName + '-index,' + numberOfItems + ',' + offset + ')'
    );
};

//module.exports = Loop;
