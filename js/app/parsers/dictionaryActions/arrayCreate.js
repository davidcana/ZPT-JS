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
    
    var indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getArrayValue( dictionary );
    arrayValue.splice( indexToUse, 0, this.newElement );
};

module.exports = ArrayCreate;
