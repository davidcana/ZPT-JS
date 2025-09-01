/*
    TALOmitTag class
*/
//var BooleanLiteral = require( '../../expressions/path/literals/booleanLiteral.js' );
//var expressionsUtils = require( '../../expressions/expressionsUtils.js' );
//var context = require( '../../context.js' );
//var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
import { BooleanLiteral } from '../../expressions/path/literals/booleanLiteral.js';
import { expressionsUtils } from '../../expressions/expressionsUtils.js';
import { context } from '../../context.js';
import { expressionBuilder } from '../../expressions/expressionBuilder.js';

export const TALOmitTag = function( stringToApply, expressionToApply ) {
    
    var string = stringToApply;
    var expression = expressionToApply;
    
    var process = function( scope, node, parserNodeRenderer ){
        
        var result = expression.evaluate( scope );
        if ( ! result ){
            return false;
        }
        
        // Process the contents
        parserNodeRenderer.defaultContent( node );
        
        // Move children from current node to its parent and then remove it
        var tags = context.getTags();
        var parentNode = node.parentNode;
        var nextSibling = node.nextSibling;
        while ( node.firstChild ) {
            if ( node.firstChild.nodeType === 1 ){
                node.firstChild.setAttribute( tags.qdup, 1 );
            }
            parentNode.insertBefore( node.firstChild, nextSibling );
        }
        parentNode.removeChild( node );

        return true;
    };
    
    var dependsOn = function( scope ){
        return expressionsUtils.buildDependsOnList( undefined, scope, expression );
    };
    
    var update = function(){
        // Nothing to do
    };
    
    var toString = function(){
        return "TALOmitTag: " + string;
    };
    
    return {
        process: process,
        dependsOn: dependsOn,
        update: update,
        toString: toString,
        type: TALOmitTag.id
    };
};

TALOmitTag.id = 'tal:omit-tag';

TALOmitTag.build = function( string ) {
    
    //var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
    
    var expressionString = string.trim();
    var expression = expressionString == ''?
            new BooleanLiteral( true ):
            expressionBuilder.build( expressionString );
    
    return new TALOmitTag( string, expression );
};

//module.exports = TALOmitTag;
