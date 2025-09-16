import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';
import { utils } from './utils.js';

var dictionary = {};

var init = function( assert ){
    
    var done = assert.async(); // QUnit's assert.async() function tells the framework to pause all tests until done() is called.
    zpt.run({
        command: 'preload',
        root: [ zz( '#m1' )[0], zz( '#m2' )[0], zz( '#m3' )[0] ],
        dictionary: dictionary,
        declaredRemotePageUrls: [],
        callback: function(){
            zpt.run();
            done();
        }
    });
};

QUnit.module( 'module', {  
    before: function( assert ){
        init( assert );
    }
});

runMacro();
runLoop();

function runMacro(){
    
    QUnit.test( "Dynamic macros test", function( assert ) {
        var t1 = `
<p>
    Before use macro
</p>
<b id="m1" data-use-macro="'dynamicMacro@externalMacros-definitions.html'" data-id="1" style="display: none;">
    Macro goes here
</b>
<p data-mmacro="dynamicMacro" data-tauto-define="_externalMacroUrl 'externalMacros-definitions.html'" data-related-id="1" data-qdup="1">
    Dynamic text: 
    <span data-content="string:A test of a dynamic macro" data-attributes="id string:t2-1" data-id="2" id="t2-1">A test of a dynamic macro</span>
</p>
<p>
    After use macro
</p>
`;
        utils.assertHtml( assert, 't1', t1 );
    });

}

function runLoop(){
    
    QUnit.test( "Dynamic macros test", function( assert ) {
        assert.equal( utils.getAllValues( '.cValue1' ) , '10/20/30' );
    });
}
