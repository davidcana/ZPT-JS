/* 
    Class ArrayDelete
*/
"use strict";

var AbstractArrayAction = require( './abstractArrayAction.js' );
var utils = require( '../../utils.js' );

var ArrayDelete = function( object, dictionary ) {
    AbstractArrayAction.call( this, object, dictionary );
};

ArrayDelete.prototype = Object.create( AbstractArrayAction.prototype );

ArrayDelete.prototype.updateDictionary = function( dictionary ){

    this.indexToUse = this.getIndexToUse( dictionary );
    var arrayValue = this.getValue( dictionary );
    arrayValue.splice( this.indexToUse, 1 );
};

ArrayDelete.prototype.updateHTML = function( indexItem, parserUpdater, actionInstance ){
    
    // Must get the nodeToUpdate
    var nodeToUpdate = this.resolveChildNode( indexItem, parserUpdater );
    if ( ! nodeToUpdate ){
        throw 'No node found to be deleted at this index: ' + this.indexToUse;
    }
    
    // Run animation
    parserUpdater.runAnimation( 
        actionInstance, 
        nodeToUpdate, 
        function(){
            
            // Delete the selected node
            parserUpdater.deleteNode( nodeToUpdate );  
        } 
    );
};

ArrayDelete.buildMultiple = function( object, dictionary ){

    var actions = [];
    var property = object.index? 'index': 'currentElement';

    // Copy indexes to a new array
    var allItems = utils.copyArray( object[ property ] );
    
    // Build actions list
    for ( var i = 0; i < allItems.length; ++i ){
        var item = allItems[ i ];
        
        // Clone the object and configure the index
        var newObject = utils.deepExtend( object );
        newObject[ property ] = item;
        
        // Instance the action instance and add it to the list
        var newActionInstance = new ArrayDelete( newObject, dictionary );
        newActionInstance.index = newActionInstance.getIndexToUse( dictionary );
        actions.push( newActionInstance );
    }
    
    // Sort actions
    actions.sort(
        function( a, b ){ return b.index - a.index; }
    );
    
    return actions;
};

module.exports = ArrayDelete;
