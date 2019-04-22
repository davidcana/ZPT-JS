/* 
    Class TalDefineHelper 
*/
"use strict";

var context = require( '../context.js' );
var TALDefine = require( '../attributes/TAL/talDefine.js' );

module.exports = function ( node ) {
    
    var defineDelimiter = context.getConf().defineDelimiter;
    var inDefineDelimiter = context.getConf().inDefineDelimiter;
    var talAutoDefine = context.getTags().talAutoDefine;
    var c = 0;
    var buffer = '';
    if ( node && node.getAttribute( talAutoDefine ) ){
        buffer = node.getAttribute( talAutoDefine );
    }
    
    var put = function( name, string ){
        
        if ( c++ > 0 ){
            buffer += defineDelimiter;
        }
        buffer += name + inDefineDelimiter + string;
    };
    
    var putAtFirst = function( string ){

        if ( c++ > 0 ){
            buffer = string + defineDelimiter + buffer;
        } else {
            buffer = string;
        }
    };
    /*
    var buildTotal = function( defineString ){
        
        if ( defineString ){
            putAtFirst( defineString );
        }
        
        return buffer;
    };
    
    var update = function( node, defineString ){
        
        var string = buildTotal( defineString );
        if ( string ){
            node.setAttribute( context.getTags().talDefine, string );
        }
        
        return string;
    };
    */
    var updateNode = function( node ){

        if ( buffer ){
            node.setAttribute( talAutoDefine, buffer );
            return buffer;
        }
    };
    
    return {
        put: put,
        //update: update,
        updateNode: updateNode
    };
};
