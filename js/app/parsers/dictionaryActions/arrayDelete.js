/* 
    Class ArrayDelete
*/
var AbstractArrayAction = require( './abstractArrayAction.js' );

var ArrayDelete = function( object ) {
    AbstractArrayAction.call( this, object );
};

ArrayDelete.prototype = Object.create( AbstractArrayAction.prototype );

ArrayDelete.prototype.updateDictionary = function( dictionary ){

    var indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getArrayValue( dictionary );
    arrayValue.splice( indexToUse, 1 );
};

module.exports = ArrayDelete;
