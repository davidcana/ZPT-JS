
import { zzDOM } from '../../../node_modules/zzdom/index.js';
const zz = zzDOM.zz;
import { zpt } from '../../../index.js';

/* Macro tests */
var root = zz( '#macro' )[0];
var dictionary = { 
    counter: 4
};

QUnit.test( "Rerun macro tests", function( assert ) {
    zpt.run({
        root: root,
        dictionary: dictionary
    });

    function continueTesting(){
        runTests( dictionary.counter );
        if ( dictionary.counter-- > 1 ){
            zpt.run();
            continueTesting();
        }
    }

    function runTests( counter ){
        assert.equal( zz('#t2-1').attr('title') , "counter=" + counter );

        assert.equal( zz('#t2-2').length, counter % 2 == 0? 1: 0 );
        /*
        if ( counter % 2 == 0 ){
            assert.ok( zz('#t2-2').isVisible() );
        } else {
            assert.notOk( zz('#t2-2').isVisible() );
        }
        */
        assert.equal( zz('#t2-3').html() , "counter=" + counter );
        assert.equal( zz('#t2-4').html() , "counter=" + counter );

        var omitHtml =  zz('#t2-5').html().trim();
        //alert(omitHtml);
        if ( counter % 2 == 0 ){
            assert.equal( omitHtml, "yes!" );
        } else{
            assert.ok( omitHtml.startsWith( "<span " ) );
            assert.ok( omitHtml.includes( "yes!" ) );
            assert.ok( omitHtml.endsWith( "</span>" ) );
        }

        assert.equal( zz('#t2-6').html().trim() , "counter=" + counter );
    }
    
    continueTesting();
});
