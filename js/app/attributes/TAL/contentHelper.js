/* 
    contentHelper singleton class
*/
//var context = require( '../../context.js' );
//var expressionBuilder = require( '../../expressions/expressionBuilder.js' );
//var evaluateHelper = require( '../../expressions/evaluateHelper.js' );
import { context } from '../../context.js';
import { expressionBuilder } from '../../expressions/expressionBuilder.js';
import { evaluateHelper } from '../../expressions/evaluateHelper.js';

export const contentHelper = (function() {

    var formInputHasBody = {
        BUTTON: 1,
        LABEL: 1,
        LEGEND: 1,
        FIELDSET: 1,
        OPTION: 1
    };
    
    var build = function( tag, string, constructorFunction ) {

        // Process it
        var content = string.trim();

        // Check if is an HTML expression
        var structure = content.indexOf( context.getConf().htmlStructureExpressionPrefix + ' ' ) === 0;
        var expressionString = structure? 
            content.substr( 1 + context.getConf().htmlStructureExpressionPrefix.length ): 
            content;
        if ( ! expressionString ){
            throw tag + ' expression void.';
        }
        
        return constructorFunction(
            string,
            expressionBuilder.build( expressionString ),
            structure,
            expressionString
        );
    };
    
    var updateNode = function( node, structure, evaluated ){

        // Check default
        if ( evaluateHelper.isDefault( evaluated ) ){
            return true;
        }

        // Check nothing
        if ( evaluateHelper.isNothing( evaluated ) ){
            evaluated = "";
        }

        // Add it to node
        node.innerHTML = evaluated;
        if ( ! structure ) {
            node[ "form" in node && !formInputHasBody[ node.tagName ] ? "value": "innerText" ] = evaluated;
        }

        return true;
    };
    
    return {
        build: build,
        updateNode: updateNode
    };
})();
