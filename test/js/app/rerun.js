$(function () {
    "use strict";

    /* Simple tests */
    /*
    var counter = 4;
    var root = $( '#simple' )[0];
    var dictionary = { 
        counter: counter
    };

    QUnit.test( "Rerun simple tests", function( assert ) {
        zpt.run( 
            root, 
            dictionary, 
            function(){
                continueTesting( root, counter );
            }
        );
    
        function continueTesting( root, counter ){
            runTests( counter );
            if ( counter > 1 ){
                var dictionary = { 
                    counter: --counter
                };
                zpt.run( 
                    root, 
                    dictionary, 
                    function(){
                        continueTesting( root, counter ) 
                    }
                );
            }
        }

        function runTests( counter ){
            assert.equal( $('#t1-1').attr('title') , "counter=" + counter );

            if ( counter % 2 == 0 ){
                assert.ok( $('#t1-2').is(':visible') );
            } else {
                assert.notOk( $('#t1-2').is(':visible') );
            }

            assert.equal( $('#t1-3').html() , "counter=" + counter );
            assert.equal( $('#t1-4').html() , "counter=" + counter );
        };
    });*/
    
    /* Macro tests */
    
    var counter = 4;
    var root = $( '#macro' )[0];
    var dictionary = { 
        counter: counter
    };
    /*
    zpt.run( 
            root, 
            dictionary
    );*/
    
    QUnit.test( "Rerun macro tests", function( assert ) {
        zpt.run( 
            root, 
            dictionary, 
            function(){
                continueTesting( root, counter );
            }
        );
    
        function continueTesting( root, counter ){
            runTests( counter );
            if ( counter > 1 ){
                var dictionary = { 
                    counter: --counter
                };
                zpt.run( 
                    root, 
                    dictionary, 
                    function(){
                        continueTesting( root, counter ) 
                    }
                );
            }
        }

        function runTests( counter ){
            assert.equal( $('#t2-1').attr('title') , "counter=" + counter );

            if ( counter % 2 == 0 ){
                assert.ok( $('#t2-2').is(':visible') );
            } else {
                assert.notOk( $('#t2-2').is(':visible') );
            }

            assert.equal( $('#t2-3').html() , "counter=" + counter );
            assert.equal( $('#t2-4').html() , "counter=" + counter );
            
            var omitHtml =  $('#t2-5').html().trim();
            if ( counter % 2 == 0 ){
                assert.equal( omitHtml, "yes!" );
            } else{
                assert.ok( omitHtml.startsWith( "<span " ) );
                assert.ok( omitHtml.includes( "yes!" ) );
                assert.ok( omitHtml.endsWith( "</span>" ) );
            }
            
            assert.equal( $('#t2-6').html().trim() , "counter=" + counter );
        };
    });
});
