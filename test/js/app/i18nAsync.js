$(function () {
    "use strict";
    
    var es1JSONFileName = 'i18n/es1.json';
    var en1JSONFileName = 'i18n/en1.json';
    var jsonFiles = [ es1JSONFileName , en1JSONFileName];
    
    translator.loadAsync( jsonFiles , callback );
    
    function callback( i18nMap ){
        
        var dictionary = {
            'i18n-ES': new I18n( 'es', i18nMap[ es1JSONFileName ] ),
            'i18n-EN': new I18n( 'en', i18nMap[ en1JSONFileName ] )
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
    }
});
