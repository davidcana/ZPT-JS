/* 
    Class ArrayUpdate
*/
"use strict";

var AbstractArrayAction = require( './abstractArrayAction.js' );
var utils = require( '../../utils.js' );

var ArrayUpdate = function( object, dictionary ) {
    AbstractArrayAction.call( this, object, dictionary );
    
    this.newElement = object.newElement;
};

ArrayUpdate.prototype = Object.create( AbstractArrayAction.prototype );

ArrayUpdate.prototype.updateDictionary = function( dictionary ){
    
    this.indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getArrayValue( dictionary );
    arrayValue[ this.indexToUse ] = this.newElement;
};

ArrayUpdate.prototype.updateHTML = function( indexItem, parserUpdater ){
    
    // Must get the nodeToUpdate
    var nodeToUpdate = this.resolveChildNode( indexItem, parserUpdater );
    if ( ! nodeToUpdate ){
        throw 'No node found to be updated at this index: ' + this.indexToUse;
    }
    
    // Update the selected node
    parserUpdater.updateNode( nodeToUpdate );
    
    return true;
};

module.exports = ArrayUpdate;
