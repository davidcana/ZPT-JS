/* 
    Class ObjectUpdate
*/
"use strict";

var AbstractObjectAction = require( './abstractObjectAction.js' );

var ObjectUpdate = function( object, dictionary ) {
    AbstractObjectAction.call( this, object, dictionary );
    
    this.newElement = object.newElement;
};

ObjectUpdate.prototype = Object.create( AbstractObjectAction.prototype );

ObjectUpdate.prototype.updateDictionary = function( dictionary ){
    
    var objectValue = this.getValue( dictionary );
    objectValue[ this.property ] = this.newElement;
};

module.exports = ObjectUpdate;
