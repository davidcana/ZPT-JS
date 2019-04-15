/* 
    Class NodeAttributes 
*/
module.exports = function( node ) {
    "use strict";
    
    var context = require( '../context.js' );
    
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
    this.talTag = undefined;
    
    // metal namespace
    this.metalDefineMacro = node.getAttribute( tags.metalDefineMacro );
    this.metalUseMacro = node.getAttribute( tags.metalUseMacro );
    this.metalDefineSlot = node.getAttribute( tags.metalDefineSlot );
    this.metalFillSlot = node.getAttribute( tags.metalFillSlot );
    
    // i18n namespace
    this.i18nDomain = node.getAttribute( tags.i18nDomain );
    this.i18nLanguage = node.getAttribute( tags.i18nLanguage );
    
    this.qdup = node.getAttribute( tags.qdup );
    
    this.updateTalDefine = function(){
        this.talDefine = node.getAttribute( tags.talDefine );
    };
};
