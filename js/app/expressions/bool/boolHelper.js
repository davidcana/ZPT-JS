/* 
    boolHelper singleton class
*/

import { context } from '../../context.js';
import { ExpressionTokenizer } from '../expressionTokenizer.js';
import { expressionBuilder } from '../expressionBuilder.js';

export const boolHelper = (function() {    
    
    var build = function( s, tag ) {
        
        var string = s.trim();
        
        if ( string.length === 0 ) {
            throw tag + ' expression void.';
        }

        var segments = new ExpressionTokenizer( 
                string, 
                context.getConf().expressionDelimiter, 
                false );
        if ( segments.countTokens() === 1 ) {
            throw 'Syntax error in expression "' + string + '". Only one element in ' + tag + ' expression, please add at least one more.';
        }
        
        return expressionBuilder.buildList( segments );
    };
    
    return {
        build: build
    };
})();
