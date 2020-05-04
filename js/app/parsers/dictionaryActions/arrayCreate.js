/* 
    Class ArrayCreate
*/
"use strict";

var AbstractArrayAction = require( './abstractArrayAction.js' );
var context = require( '../../context.js' );
var ParserNodeRenderer = require( '../../parsers/parserNodeRenderer.js' );

var ArrayCreate = function( object, dictionary ) {
    AbstractArrayAction.call( this, object, dictionary );
    
    this.newElement = object.newElement;
};

ArrayCreate.prototype = Object.create( AbstractArrayAction.prototype );

ArrayCreate.prototype.updateDictionary = function( dictionary ){
    
    this.indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getValue( dictionary );
    
    if ( this.indexToUse === -1 ){
        arrayValue.push( this.newElement );
    } else {
        arrayValue.splice( this.indexToUse, 0, this.newElement );
    }
};

ArrayCreate.prototype.updateHTML = function( indexItem, parserUpdater ){
    
    // Must get the nodeToUpdate
    var node = this.resolveThisNode( indexItem, parserUpdater );
    if ( ! node ){
        throw 'No node found to clone';
    }
    
    // Init some vars
    var tags = context.getTags();
    var parentNode = node.parentNode;
    
    // Clone and configure the node
    var tmpNode = ParserNodeRenderer.cloneAndConfigureNode( 
        node, 
        true, 
        tags, 
        node.getAttribute( tags.id ) 
    );
    ParserNodeRenderer.configureNodeForNewItem( 
        tmpNode, 
        tags, 
        parentNode, 
        indexItem, 
        this.indexToUse
    );
    
    // Insert it
    var sibling = this.indexToUse === -1?
        null:
        parentNode.children[ 1 + this.indexToUse ];
    parentNode.insertBefore( tmpNode, sibling );
    
    // Update the selected node
    parserUpdater.updateNode( tmpNode );
};

module.exports = ArrayCreate;
