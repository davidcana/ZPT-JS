/* 
    Class ArrayDelete
*/
var AbstractArrayAction = require( './abstractArrayAction.js' );

var ArrayDelete = function( object ) {
    AbstractArrayAction.call( this, object );
};

ArrayDelete.prototype = Object.create( AbstractArrayAction.prototype );

ArrayDelete.prototype.updateDictionary = function( dictionary ){

    this.indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getArrayValue( dictionary );
    arrayValue.splice( this.indexToUse, 1 );
};

ArrayDelete.prototype.updateHTML = function( indexItem, parserUpdater ){
    
    // Must get the nodeToUpdate
    var nodeToUpdate = this.resolveChildNode( indexItem, parserUpdater );
    if ( ! nodeToUpdate ){
        throw 'No node found to be deleted at this index: ' + this.indexToUse;
    }
    
    // Delete the selected node
    parserUpdater.deleteNode( nodeToUpdate );
    
    return true;
};

module.exports = ArrayDelete;
