/* 
    Class dictionaryActionBuilder 
*/
"use strict";

var ArrayUpdate = require( './arrayUpdate.js' );
var ArrayDelete = require( './arrayDelete.js' );

module.exports = (function() {
    
    var build = function( object ) {
        
        switch ( object.action ) {
            case 'update':
                return new ArrayUpdate( object );
            case 'delete':
                return new ArrayDelete( object );
            case 'create':

                break;
            default:
                throw 'Unknown dictionary action: ' + object.action();
        }
    };
    
    var self = {
        build: build
    };
    
    return self;
})();
