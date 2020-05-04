/* 
    Class dictionaryActionBuilder 
*/
"use strict";

var ArrayUpdate = require( './arrayUpdate.js' );
var ArrayDelete = require( './arrayDelete.js' );
var ArrayCreate = require( './arrayCreate.js' );
var ObjectUpdate = require( './objectUpdate.js' );
var ObjectDelete = require( './objectDelete.js' );

module.exports = (function() {
    
    var build = function( object, dictionary ) {
        
        switch ( object.action ) {
        case 'updateArray':
            return new ArrayUpdate( object, dictionary );
        case 'deleteArray':
            return new ArrayDelete( object, dictionary );
        case 'createArray':
            return new ArrayCreate( object, dictionary );
        case 'updateObject':
            return new ObjectUpdate( object, dictionary );
        case 'deleteObject':
            return new ObjectDelete( object, dictionary );
        default:
            throw 'Unknown dictionary action: ' + object.action;
        }
    };
    
    var self = {
        build: build
    };
    
    return self;
})();
