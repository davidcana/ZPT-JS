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

AbstractObjectAction.prototype.updateHTML = function( indexItem, parserUpdater, actionInstance ){
    
    // Must get the node
    var node = this.resolveThisNode( indexItem, parserUpdater );
    if ( ! node ){
        throw 'No node found to update';
    }
    
    // Update the selected node
    parserUpdater.updateNode( node );
    
    // Run animation
    parserUpdater.runAnimation( actionInstance, node );
    
    return true;
};

module.exports = AbstractObjectAction;
