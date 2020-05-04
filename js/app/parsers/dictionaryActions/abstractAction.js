/* 
    Class AbstractAction
*/
"use strict";

var utils = require( '../../utils.js' );

var AbstractAction = function( object, dictionary ) {
    
    this.id = object.id;
    this.var = object.var;
    this.currentElement = object.currentElement;
    if ( object.search ){
        if ( this.id || this.var ){
            throw 'Error in action: you can not set a search and then an id or var: if you set a search ZPT-JS will set the id and var for you!';
        }
        this.initializeUsingSearch( object.search, dictionary );
    }
};

AbstractAction.prototype.initializeUsingSearch = function( search, dictionary ){

    this.id = '';
    this.var = dictionary;
    
    // Iterate search items and build id and var
    for ( var i = 0; i < search.length; ++i ){
        var item = search[ i ];
        
        if ( utils.isPlainObject( item ) ){
            item = this.search( this.var, item );
        }
        
        if ( Number.isInteger( item ) ){
            this.id += '[' + item + ']';
        } else {
            var separator = i === 0? '': '.';
            this.id += separator + item;
        }
        
        this.var = this.var[ item ];
    }
};

AbstractAction.prototype.search = function( list, criteria ){

    for ( var i = 0; i < list.length; ++i ){
        var record = list[ i ];
        var thisRecordValue = record[ criteria.name ];
        if ( utils.deepEqual( thisRecordValue, criteria.value ) ){
            return i;
        }
    }
    
    throw 'No record found matching your criteria!';
};

AbstractAction.prototype.getValue = function( dictionary ){
    return this.var === undefined?
        dictionary[ this.id ]:
        this.var;
};

AbstractAction.prototype.resolveThisNode = function( indexItem, parserUpdater ){
    
    //var attributeInstance = indexItem.attributeInstance;
    var node = parserUpdater.findNodeById( indexItem.nodeId );
    if ( ! node ){
        // Removed node!
        parserUpdater.addRemovedToStatistics();
        return false;
    }
    parserUpdater.addUpdatedToStatistics();
    
    // Return the node
    return node;
};

AbstractAction.prototype.attributeInstanceIsRelated = function( attributeInstance ){
    throw 'Error: attributeInstanceIsRelated must be implemented!';
};

AbstractAction.prototype.updateDictionary = function(){
    throw 'Error: updateDictionary must be implemented!';
};

AbstractAction.prototype.updateHTML = function(){
    throw 'Error: updateHTML must be implemented!';
};

module.exports = AbstractAction;
