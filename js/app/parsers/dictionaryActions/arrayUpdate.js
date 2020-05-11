/* 
    Class ArrayUpdate
*/
"use strict";

var AbstractArrayAction = require( './abstractArrayAction.js' );

var ArrayUpdate = function( object, dictionary ) {
    AbstractArrayAction.call( this, object, dictionary );
    
    this.newElement = object.newElement;
};

ArrayUpdate.prototype = Object.create( AbstractArrayAction.prototype );

ArrayUpdate.prototype.updateDictionary = function( dictionary ){
    
    this.indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getValue( dictionary );
    arrayValue[ this.indexToUse ] = this.newElement;
};

ArrayUpdate.prototype.updateHTML = function( indexItem, parserUpdater, actionInstance ){
    
    // Must get the nodeToUpdate
    var nodeToUpdate = this.resolveChildNode( indexItem, parserUpdater );
    if ( ! nodeToUpdate ){
        throw 'No node found to be updated at this index: ' + this.indexToUse;
    }
    
    // Update the selected node
    parserUpdater.updateNode( nodeToUpdate, true );
    
    // Run animation
    parserUpdater.runAnimation( actionInstance, nodeToUpdate );
    
    return true;
};

module.exports = ArrayUpdate;
