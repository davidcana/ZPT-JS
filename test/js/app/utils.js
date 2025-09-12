/*
    utils singleton class
*/

import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { htmlComparator } from './htmlComparator.js';

export const utils = (function() {
    
    var getAllValues = function( selector ){
        
        var result = '';
        
        zz( selector ).each( 
            function( index, ss ) {
                if (  index > 0 ){
                    result += '/';
                }
                result += this.innerHTML;
            }
        );
        
        return result;
    };
    /*
    var getAllValues = function( selector ){
        
        return $( selector ).map( function( index, element ) {
            return this.innerHTML;
        } ).get().join( '/' );
    };
    */
    
    var getAllNodeIds = function( selector ){
        
        var result = '';
        
        zz( selector ).each( 
            function( index, ss ) {
                if (  index > 0 ){
                    result += '/';
                }
                result += this.getAttribute( 'data-id' );
            }
        );
        
        return result;
    };
    /*
    var getAllNodeIds = function( selector ){
        
        return $( selector ).map( function( index, element ) {
            return this.getAttribute( 'data-id' );
        } ).get().join( '/' );
    };
    */
    
    var getAllChildrenAttrs = function( selector, attr ){
        
        var result = '';
        
        zz( selector )
            .children()
            .each( 
                function( index, ss ) {
                    if (  index > 0 ){
                        result += '/';
                    }
                    result += this.getAttribute( attr );
                }
        );
        
        return result;
    };

    var getMilliseconds = function ( startDate ) {
        
        var endDate   = new Date();
        var seconds = (endDate.getTime() - startDate.getTime());
        
        return seconds;
    };
    
    var assertHtml = function ( assert, id, expectedHtml ){
        
        var actualElement = window.document.getElementById( id );
        var compare = htmlComparator.compare( 
            actualElement.innerHTML,
            expectedHtml 
        );
        if ( compare.equals ){
            assert.ok( true );
        } else {
            Qunit.dump.setParser(
                'string',
                function( str ){
                    return str;
                }
            );
            assert.pushResult({
                result: false,
                actual: compare.actual,
                expected: compare.expected,
                message: 'HTML should be equal!',
                negative: false
            });
        }
    };
    /*
    var assertHtml = function ( assert, id, html ){
        assert.equal( 
            zz( id ).html().replace(/(\r\n|\n|\r|\t| )/gm,"") , 
            html.replace(/(\r\n|\n|\r|\t| )/gm,"")
        );
    };
    */
    /*
    var assertHtml = function ( assert, id1, id2 ){
        assert.equal( 
            zz( id1 ).text().replace(/\s+/g, ""), 
            zz( id2 ).text().replace(/\s+/g, "")
        ); 
    };
    */
    
    var count = function( selector ){
        
        var result = 0;
        
        zz( selector ).each( 
            function( index, ss ) {
                ++result;
            }
        );
        
        return result;
    };
    /*
    var count = function ( selector ){
        return $( selector ).map( function( index, element ) {
            return this.innerHTML;
        } ).get().length;
    };
    */
    
    return {
        getAllValues: getAllValues,
        getAllNodeIds: getAllNodeIds,
        getAllChildrenAttrs: getAllChildrenAttrs,
        getMilliseconds: getMilliseconds,
        assertHtml: assertHtml,
        count: count
    };
})();
