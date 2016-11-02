/* Class ExpressionTokenizer */
var ZPT = ZPT || {};

ZPT.ExpressionTokenizer = function( exp, delimiter, escape ) {
    var removeParenthesisIfAny = ZPT.expressionEvaluator.removeParenthesisIfAny;
    var expression = exp.trim();

    var iterator;
    var currIndex = 0;
    var delimiterCount = 0;
    var delimiters = [];
    
    var makeIterator = function( array ){
        var nextIndex = 0;
        
        return {
            next: function(){
                return nextIndex < array.length ?
                   array [ nextIndex++ ] :
                   undefined;
            },
            hasNext: function(){
                return nextIndex < array.length;
           }
        };
    };
    
    var analyze = function(){
        var avoidRepeatedSeparators = delimiter == ' ';
        
        // Go ahead and find delimiters, if any, at construction time
        var parentLevel = 0;
        var inQuote = false;
        var previousCh = '';
        
        // Scan for delimiters
        var length = expression.length;
        for ( var i = 0; i < length; i++ ) {
            var ch = expression.charAt( i );
            
            if ( ch == delimiter ) {
                // If delimiter is not buried in parentheses or a quote
                if ( parentLevel == 0 && ! inQuote  ) {
                    
                    if ( avoidRepeatedSeparators && ( previousCh == delimiter || previousCh == '\n' ) ) {
                        continue;
                    }
                    
                    var nextCh = ( i + 1 < length ) ? expression.charAt( i + 1 ) : '';
                    
                    // And if delimiter is not escaped
                    if ( ! ( escape && nextCh == delimiter ) ) {
                        delimiterCount++;
                        delimiters.push( i );
                    }
                    else {
                        // Somewhat inefficient way to pare the
                        // escaped delimiter down to a single
                        // character without breaking our stride
                        expression = expression.substring( 0, i + 1 ) + expression.substring( i + 2 );
                        length--;
                    }
                }
            }
            
            // Increment parenthesis level
            else if ( ch == '(' || ch == '[' ) {
                parentLevel++;
            }
            
            // Decrement parenthesis level
            else if ( ch == ')' || ch == ']' ) {
                parentLevel--;
                // If unmatched right parenthesis
                if ( parentLevel < 0 ) {
                    throw 'Syntax error: unmatched right parenthesis: ' + expression;
                }
            }
            
            // Start or end quote
            else if ( ch == '\'' ) {
                inQuote = ! inQuote;
            }
            
            previousCh = ch;
        }
        
        // If unmatched left parenthesis
        if ( parentLevel > 0 ) {
            throw 'Syntax error: unmatched left parenthesis: ' + expression;
        }
        
        // If runaway quote
        if ( inQuote ) {
            throw 'Syntax error: runaway quotation: ' + expression;
        }
        
        iterator = makeIterator( delimiters );
    }();
    
    var hasMoreTokens = function( ) {
        return currIndex < expression.length;
    };
    
    var nextToken = function( ) {
        var token;
        
        if ( iterator.hasNext() ) {
            var next = iterator.next();
            var delim = parseInt( next );
            token = expression.substring( currIndex, delim ).trim();
            currIndex = delim + 1;
            delimiterCount--;
            
            return removeParenthesisIfAny( token );
        }
        
        token = expression.substring( currIndex ).trim();
        currIndex = expression.length;
        
        return removeParenthesisIfAny( token );
    };
        
    var countTokens = function( ) {
        if ( hasMoreTokens() ) {
            return delimiterCount + 1;
        }
        return 0;
    };
    
    return {
        hasMoreTokens: hasMoreTokens,
        nextToken: nextToken,
        countTokens: countTokens
    };
};
