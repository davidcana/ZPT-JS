/* 
    Class AutoDefineHelper 
*/

import { context } from '../context.js';

export const AutoDefineHelper = function ( node ) {
    
    var defineDelimiter = context.getConf().defineDelimiter;
    var inDefineDelimiter = context.getConf().inDefineDelimiter;
    var nocallExpressionPrefix = context.getConf().nocallVariableExpressionPrefix;
    var talAutoDefine = context.getTags().talAutoDefine;

    var buffer = '';
    if ( node && node.getAttribute( talAutoDefine ) ){
        buffer = node.getAttribute( talAutoDefine );
    }
    
    var put = function( name, string, nocall ){
        
        if ( buffer !== '' ){
            buffer += defineDelimiter;
        }
        buffer += (nocall? nocallExpressionPrefix + inDefineDelimiter: '') + name + inDefineDelimiter + string;
    };

    var updateNode = function( node ){

        if ( buffer ){
            node.setAttribute( talAutoDefine, buffer );
            return buffer;
        }
    };
    
    return {
        put: put,
        updateNode: updateNode
    };
};
