/* 
    Class ArrayCreate
*/
var AbstractArrayAction = require( './abstractArrayAction.js' );

var ArrayCreate = function( object ) {
    AbstractArrayAction.call( this, object );
    
    this.newElement = object.newElement;
};

ArrayCreate.prototype = Object.create( AbstractArrayAction.prototype );

ArrayCreate.prototype.updateDictionary = function( dictionary ){
    
    this.indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getArrayValue( dictionary );
    arrayValue.splice( this.indexToUse, 0, this.newElement );
};

module.exports = ArrayCreate;
