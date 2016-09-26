/* ZPTContext singleton class */
var zptContext = (function() {
    var defaultTags = {
            talCondition:     "data-tcondition",
            talRepeat:        "data-trepeat",
            talAttributes:    "data-tattributes",
            talContent:       "data-tcontent",
            talDefine:        "data-tdefine",
            talOmitTag:       "data-tomit-tag",
            talReplace:       "data-treplace",
            talOnError:       "data-ton-error",
            qdup:             "data-qdup",
            metalDefineMacro: "data-mdefine-macro",
            metalUseMacro:    "data-muse-macro",
            metalDefineSlot:  "data-mdefine-slot",
            metalFillSlot:    "data-mfill-slot",
            metalMacro:       "data-mmacro"
    };
    var tags = defaultTags;
    var tal = '';
    //var self = this;
    
    var getTags = function (){
        return tags;
    };
    
    var setTags = function ( tagsToSet ){
        tags = tagsToSet;
        tal = '';
    };
    
    var getTal = function (){
        if ( tal == '' ){
            var c = 0;
            var notInclude = tags.qdup;
            for ( property in tags ) {
                if ( notInclude == tags[ property ] ){
                    continue;
                }
                if ( c++ > 0){
                    tal += ",";
                }
                tal += "*[" + tags[ property ] + "]";
            }
        }
        
        return tal;
    };

    return {
        getTags: getTags,
        setTags: setTags,
        getTal: getTal
    };
})();
