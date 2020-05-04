/* 
    Class dictionaryActionBuilder 
*/
"use strict";

var ArrayUpdate = require( './arrayUpdate.js' );
var ArrayDelete = require( './arrayDelete.js' );
var ArrayCreate = require( './arrayCreate.js' );
var ObjectUpdate = require( './objectUpdate.js' );

module.exports = (function() {
    
    var build = function( object, dictionary ) {
        
        switch ( object.action ) {
        case 'update':
            return new ArrayUpdate( object, dictionary );
        case 'delete':
            return new ArrayDelete( object, dictionary );
        case 'create':
            return new ArrayCreate( object, dictionary );
        case 'updateObject':
            return new ObjectUpdate( object, dictionary );
        default:
            throw 'Unknown dictionary action: ' + object.action;
        }
    };
    
    var self = {
        build: build
    };
    
    return self;
})();
