/* 
    Class ArrayUpdate
*/
var AbstractArrayAction = require( './abstractArrayAction.js' );

var ArrayUpdate = function( object ) {
    AbstractArrayAction.call( this, object );
    
    this.newElement = object.newElement;
};

ArrayUpdate.prototype = Object.create( AbstractArrayAction.prototype );

ArrayUpdate.prototype.updateDictionary = function( dictionary ){
    
    var indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getArrayValue( dictionary );
    arrayValue[ indexToUse ] = this.newElement;
};

module.exports = ArrayUpdate;
