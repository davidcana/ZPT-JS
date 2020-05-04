/* 
    Class AbstractObjectAction
*/
"use strict";

var AbstractAction = require( './abstractAction.js' );

var AbstractObjectAction = function( object, dictionary ) {
    AbstractAction.call( this, object, dictionary );
    
    this.property = object.property;
    this.id += '.' + object.property;
};

AbstractObjectAction.prototype = Object.create( AbstractAction.prototype );

AbstractObjectAction.prototype.attributeInstanceIsRelated = function( attributeInstance ){
    return true;
};

AbstractObjectAction.prototype.getObjectValue = function( dictionary ){
    return this.var === undefined?
        dictionary[ this.id ]:
        this.var;
};

module.exports = AbstractObjectAction;
