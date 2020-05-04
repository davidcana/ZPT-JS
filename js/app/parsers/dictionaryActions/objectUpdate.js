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
    
    var objectValue = this.getObjectValue( dictionary );
    objectValue[ this.property ] = this.newElement;
};

ObjectUpdate.prototype.updateHTML = function( indexItem, parserUpdater ){
    
    // Must get the node
    var node = this.resolveThisNode( indexItem, parserUpdater );
    if ( ! node ){
        throw 'No node found to update';
    }
    
    // Update the selected node
    parserUpdater.updateNode( node );
    
    return true;
};

module.exports = ObjectUpdate;
