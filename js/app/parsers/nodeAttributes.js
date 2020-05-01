/* 
    Class NodeAttributes 
*/
"use strict";

var context = require( '../context.js' );

var NodeAttributes = function( node, indexExpressions ) {
    
    var tags = context.getTags();
    
    // tal namespace
    this.talDefine = node.getAttribute( tags.talDefine );
    this.talCondition = node.getAttribute( tags.talCondition );
    this.talRepeat = node.getAttribute( tags.talRepeat );
    this.talContent = node.getAttribute( tags.talContent );
    this.talAttributes = node.getAttribute( tags.talAttributes );
    this.talOmitTag = node.getAttribute( tags.talOmitTag );
    this.talReplace = node.getAttribute( tags.talReplace );
    this.talOnError = node.getAttribute( tags.talOnError );
    this.talDeclare = node.getAttribute( tags.talDeclare );
    //this.talTag = undefined;
    
    // metal namespace
    this.metalDefineMacro = node.getAttribute( tags.metalDefineMacro );
    this.metalUseMacro = node.getAttribute( tags.metalUseMacro );
    this.metalDefineSlot = node.getAttribute( tags.metalDefineSlot );
    this.metalFillSlot = node.getAttribute( tags.metalFillSlot );
    
    // i18n namespace
    this.i18nDomain = node.getAttribute( tags.i18nDomain );
    this.i18nLanguage = node.getAttribute( tags.i18nLanguage );
    
    // For internal use
    this.qdup = node.getAttribute( tags.qdup );
    
    // Init this.id and set the node id if indexExpressions is true, some attribute is set and it is undefined
    if ( indexExpressions && this.isDynamicContentOn() ){
        this.id = node.getAttribute( tags.id );
        if ( ! this.id ){
            //this.id = utils.generateId( 6 );
            this.id = context.nextExpressionCounter();
            node.setAttribute( tags.id, this.id );
        }
    }
};

NodeAttributes.prototype.isDynamicContentOn = function() {
    
    return this.talDefine 
        || this.talCondition
        || this.talRepeat
        || this.talContent
        || this.talAttributes
        || this.talOmitTag 
        || this.talReplace
        || this.talOnError
        || this.talDeclare
        //|| this.talTag
        //|| this.metalDefineMacro 
        || this.metalUseMacro 
        //|| this.metalDefineSlot 
        || this.metalFillSlot 
        || this.i18nDomain
        || this.i18nLanguage;
        //|| this.qdup;
};

module.exports = NodeAttributes;
