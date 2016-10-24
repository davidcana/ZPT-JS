$(function () {
    "use strict";
    
    var es1JSONFileName = 'i18n/es1.json';
    var en1JSONFileName = 'i18n/en1.json';
    var es2JSONFileName = 'i18n/es2.json';
    var en2JSONFileName = 'i18n/en2.json';
    
    var jsonFiles = [ es1JSONFileName , en1JSONFileName, es2JSONFileName , en2JSONFileName ];
    
    translator.loadAsync( jsonFiles , callback );
    
    function callback( i18nMap ){
        
        var dictionary = {
            'i18n-ES' : new I18n( 'es', i18nMap[ es1JSONFileName ] ),
            'i18n-EN' : new I18n( 'en', i18nMap[ en1JSONFileName ] ),
            'i18n-ES2': new I18n( 'es', i18nMap[ es2JSONFileName ] ),
            'i18n-EN2': new I18n( 'en', i18nMap[ en2JSONFileName ] ),
            fireError: function( ){
                //return 1 / 0;
                document.getElementById("mydiv").innerHTML='Success'; //assuming "mydiv" is undefined
            }
        };
        
        zpt.run( document.body, dictionary );
        /*
        $( 'body' ).zpt({
            dictionary: dictionary
        });*/
        
        QUnit.test( "Simple i18n test", function( assert ) {
            assert.equal( $('#t1-1').html() , "¡Hola mundo!" );
            assert.equal( $('#t1-2').html() , "Hello world!" );
        });
        
        QUnit.test( "With parameters (spanish)", function( assert ) {
            assert.equal( $('#t2-1').html() , "Él no ha encontrado ningún resultado" );
            assert.equal( $('#t2-2').html() , "Él ha encontrado un único resultado" );
            assert.equal( $('#t2-3').html() , "Él ha encontrado 10 resultados" );
            assert.equal( $('#t2-4').html() , "Ella no ha encontrado ningún resultado" );
            assert.equal( $('#t2-5').html() , "Ella ha encontrado un único resultado" );
            assert.equal( $('#t2-6').html() , "Ella ha encontrado 10 resultados" );
            assert.equal( $('#t2-7').html() , "Ellos no han encontrado ningún resultado" );
            assert.equal( $('#t2-8').html() , "Ellos han encontrado un único resultado" );
            assert.equal( $('#t2-9').html() , "Ellos han encontrado 10 resultados" );
        });
        
        QUnit.test( "With parameters (english)", function( assert ) {
            assert.equal( $('#t3-1').html() , "He found no results" );
            assert.equal( $('#t3-2').html() , "He found 1 result" );
            assert.equal( $('#t3-3').html() , "He found 10 results" );
            assert.equal( $('#t3-4').html() , "She found no results" );
            assert.equal( $('#t3-5').html() , "She found 1 result" );
            assert.equal( $('#t3-6').html() , "She found 10 results" );
            assert.equal( $('#t3-7').html() , "They found no results" );
            assert.equal( $('#t3-8').html() , "They found 1 result" );
            assert.equal( $('#t3-9').html() , "They found 10 results" );
        });
        
        QUnit.test( "2 domains in domain definition: i18n-ES2 i18n-ES (spanish)", function( assert ) {
            assert.equal( $('#t4-1').html() , "¡¡¡Hola mundo 2!!!" );
            assert.equal( $('#t4-2').html() , "Él no ha encontrado ningún resultado" );
        });

        QUnit.test( "2 domains in domain definition: i18n-EN2 i18n-EN (english) ", function( assert ) {
            assert.equal( $('#t5-1').html() , "Hello world 2.0!!!" );
            assert.equal( $('#t5-2').html() , "He found no results" );
        });

        QUnit.test( "Nested domains: i18n-ES and i18n-ES2 nested (spanish) ", function( assert ) {
            assert.equal( $('#t6-1').html() , "¡¡¡Hola mundo 2!!!" );
            assert.equal( $('#t6-2').html() , "Él no ha encontrado ningún resultado" );
        });

        QUnit.test( "Nested domains: i18n-EN and i18n-EN2 nested (english) ", function( assert ) {
            assert.equal( $('#t7-1').html() , "Hello world 2.0!!!" );
            assert.equal( $('#t7-2').html() , "He found no results" );
        });
        
        QUnit.test( "Attributes test (spanish)", function( assert ) {
            assert.equal( $('#t8-1').attr('title') , "¡Hola mundo!" );
            assert.equal( $('#t8-2').attr('title') , "Ella ha encontrado 4 resultados" );
            assert.equal( $('#t8-3').attr('title') , "¡Hola mundo!" );
            assert.equal( $('#t8-3').attr('alt') , "Ella ha encontrado 4 resultados" );
            assert.equal( $('#t8-4').attr('title') , "¡Hola mundo!" );
            assert.equal( $('#t8-4').attr('alt') , "Ella ha encontrado 4 resultados" );
            assert.equal( $('#t8-4').attr('longdesc') , "http://www.fsf.org" );
        });

        QUnit.test( "Attributes test (english)", function( assert ) {
            assert.equal( $('#t9-1').attr('title') , "Hello world!" );
            assert.equal( $('#t9-2').attr('title') , "She found 4 results" );
            assert.equal( $('#t9-3').attr('title') , "Hello world!" );
            assert.equal( $('#t9-3').attr('alt') , "She found 4 results" );
            assert.equal( $('#t9-4').attr('title') , "Hello world!" );
            assert.equal( $('#t9-4').attr('alt') , "She found 4 results" );
            assert.equal( $('#t9-4').attr('longdesc') , "http://www.fsf.org" );
        });
    
        QUnit.test( "Replace (spanish) ", function( assert ) {
            assert.equal( $('#t10-1').html().trim() , "¡Hola mundo!" );
            assert.equal( $('#t10-2').html().trim() , "Él ha encontrado un único resultado" );
        });

        QUnit.test( "Replace (english) ", function( assert ) {
            assert.equal( $('#t11-1').html().trim() , "Hello world!" );
            assert.equal( $('#t11-2').html().trim() , "He found 1 result" );
        });
        
        QUnit.test( "Define (spanish) ", function( assert ) {
            assert.equal( $('#t12-1').html(), "¡Hola mundo!" );
            assert.equal( $('#t12-2').html(), "Él ha encontrado un único resultado" );
            assert.equal( $('#t12-3').html(), "¡Hola mundo!" );
            assert.equal( $('#t12-4').html(), "Él ha encontrado un único resultado" );
        });

        QUnit.test( "Define (english) ", function( assert ) {
            assert.equal( $('#t13-1').html(), "Hello world!" );
            assert.equal( $('#t13-2').html(), "He found 1 result" );
            assert.equal( $('#t13-3').html(), "Hello world!" );
            assert.equal( $('#t13-4').html(), "He found 1 result" );
        });
        
        QUnit.test( "On error test (spanish)", function( assert ) {
            assert.equal( $('#t14-1').html() , "¡Hola mundo!" );
            assert.equal( $('#t14-2').html() , "Error encontrado... Oh, noooo!" );
        });

        QUnit.test( "On error test (english)", function( assert ) {
            assert.equal( $('#t15-1').html() , "Hello world!" );
            assert.equal( $('#t15-2').html() , "Error found... Oh, noooo!" );
        });
    }
});
