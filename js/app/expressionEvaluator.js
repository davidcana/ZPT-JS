/* ExpressionEvaluator singleton class */
var expressionEvaluator = (function() {
    //var self = this;
    
    var PATH_DELIMITER = '|';
    var PATH_SEGMENT_DELIMITER = '/';
    var EXPRESSION_DELIMITER = ' ';
    var INTERVAL_DELIMITER = ':';
    
    var EXPRESSION_SUFFIX = ":";
    var EXPR_STRING = "string" + EXPRESSION_SUFFIX;
    var EXPR_EXISTS = "exists" + EXPRESSION_SUFFIX;
    var EXPR_NOCALL = "nocall" + EXPRESSION_SUFFIX;
    var EXPR_NOT = "not" + EXPRESSION_SUFFIX;
    var EXPR_JAVASCRIPT = "js" + EXPRESSION_SUFFIX;
    var EXPR_EQUALS = "eq" + EXPRESSION_SUFFIX;
    var EXPR_GREATER = "gt" + EXPRESSION_SUFFIX;
    var EXPR_LOWER = "lt" + EXPRESSION_SUFFIX;
    var EXPR_ADD = "+" + EXPRESSION_SUFFIX;
    var EXPR_SUB = "-" + EXPRESSION_SUFFIX;
    var EXPR_MUL = "*" + EXPRESSION_SUFFIX;
    var EXPR_DIV = ":" + EXPRESSION_SUFFIX;
    var EXPR_MOD = "%" + EXPRESSION_SUFFIX;
    var EXPR_OR = "or" + EXPRESSION_SUFFIX;
    var EXPR_AND = "and" + EXPRESSION_SUFFIX;
    var EXPR_COND = "cond" + EXPRESSION_SUFFIX;
    var EXPR_JQUERY = "$";
    
    var evaluateToNotNull = function( scope, expression ) {
        var evaluated = evaluate( scope, expression );
        return evaluated == undefined? 'undefined': evaluated;
    };
    
    var evaluate = function( scope, expression ) {
        
        var effectiveExpression = removeParenthesisIfAny(
                expression.trim() );
        
        // General purpose expressions
        if ( expression.indexOf( EXPR_STRING ) == 0 ) {
            return evaluateString( scope, effectiveExpression.substr( EXPR_STRING.length ) );
        }
        if ( expression.indexOf( EXPR_NOCALL ) == 0 ) {
            return evaluateNoCall( scope, effectiveExpression.substr( EXPR_NOCALL.length ) );
        }
        if ( expression.indexOf( EXPR_JAVASCRIPT ) == 0 ) {
            return evaluateJavascript( scope, effectiveExpression.substr( EXPR_JAVASCRIPT.length ) );
        }
        if ( expression.indexOf( EXPR_JQUERY ) == 0 ) {
            return evaluateJQuery( scope, effectiveExpression );
        }
        
        // Comparison expressions
        if ( expression.indexOf( EXPR_EQUALS ) == 0 ) {
            return evaluateEquals( scope, effectiveExpression.substr( EXPR_EQUALS.length ) );
        }
        if ( expression.indexOf( EXPR_GREATER ) == 0 ) {
            return evaluateGreater( scope, effectiveExpression.substr( EXPR_GREATER.length ) );
        }
        if ( expression.indexOf( EXPR_LOWER ) == 0 ) {
            return evaluateLower( scope, effectiveExpression.substr( EXPR_LOWER.length ) );
        }
        
        // Arithmetic expressions
        if ( expression.indexOf( EXPR_ADD ) == 0 ) {
            return evaluateArithmetic( scope, effectiveExpression.substr( EXPR_ADD.length ), EXPR_ADD );
        }
        if ( expression.indexOf( EXPR_SUB ) == 0 ) {
            return evaluateArithmetic( scope, effectiveExpression.substr( EXPR_SUB.length ), EXPR_SUB );
        }
        if ( expression.indexOf( EXPR_MUL ) == 0 ) {
            return evaluateArithmetic( scope, effectiveExpression.substr( EXPR_MUL.length ), EXPR_MUL );
        }
        if ( expression.indexOf( EXPR_DIV ) == 0 ) {
            return evaluateArithmetic( scope, effectiveExpression.substr( EXPR_DIV.length ), EXPR_DIV );
        }
        if ( expression.indexOf( EXPR_MOD ) == 0 ) {
            return evaluateArithmetic( scope, effectiveExpression.substr( EXPR_MOD.length ), EXPR_MOD );
        }
        
        // Logical expressions
        if ( expression.indexOf( EXPR_EXISTS ) == 0 ) {
            return evaluateExists( scope, effectiveExpression.substr( EXPR_EXISTS.length ) );
        }
        if ( expression.indexOf( EXPR_NOT ) == 0 ) {
            return evaluateNot( scope, effectiveExpression.substr( EXPR_NOT.length ).trim() );
        }
        if ( expression.indexOf( EXPR_OR ) == 0 ) {
            return evaluateOr( scope, effectiveExpression.substr( EXPR_OR.length ) );
        }
        if ( expression.indexOf( EXPR_AND ) == 0 ) {
            return evaluateAnd( scope, effectiveExpression.substr( EXPR_AND.length ) );
        }
        if ( expression.indexOf( EXPR_COND ) == 0 ) {
            return evaluateCond( scope, effectiveExpression.substr( EXPR_COND.length ) );
        }
        
        return evaluatePath( scope, effectiveExpression );
    };
    
    var evaluateBoolean = function( scope, expression ) {
        var value = evaluate( scope, expression ); 
        
        if ( value === undefined
            || value == null
            || value == 'false' 
            || value == false 
            || value == 0 ){
            return false;
        }
        
        return true;
    };
    
    var evaluateExists = function( scope, expression ) {
        return evaluateBoolean( scope, expression );
    };
    
    var evaluateNoCall = function( scope, expression ) {
        throw "Nocall expressions not implemented yet!";
    };
    
    var evaluateNot = function( scope, expression ) {
        return ! evaluateBoolean( scope, expression );
    };
    
    var evaluateJavascript = function( scope, expression ) {
        var evaluatedString = evaluateString( scope, expression );
        return eval( evaluatedString );
    };
    
    var evaluateJQuery = function( scope, expression ) {
        
        try {
            var evaluated = eval( expression );
            
            // String
            if ( typeof evaluated == "string" ){
                return evaluated;
            }
            
            // Element with length 1
            if ( evaluated.length == 1 ){
                return evaluated.text();
            }
            
            // Element with length > 1
            var texts = [];
            evaluated.each( function() {
                texts.push( $(this).text() );
            });
            return texts;
            
        } catch ( e ){
            return "Jquery expression error!";
        }
    };
    
    var evaluateEquals = function( scope, expression ) {
        if ( expression.length == 0 ) {
            throw 'Equals expression void.';
        }

        var segments = new ExpressionTokenizer( expression, EXPRESSION_DELIMITER, false );
        if ( segments.countTokens() == 1 ) {
            throw 'Only one element in equals expression, please add at least one more.';
        }
        
        var segment1 = segments.nextToken().trim();
        var result1 = evaluate( scope, segment1 );
        
        while ( segments.hasMoreTokens() ) {
            var segment = segments.nextToken().trim();
            var result = evaluate( scope, segment );
            if ( result1 != result ){
                return false;
            }
        }

        return true;
    };
    
    var evaluateGreaterOrLowerCommon = function( scope, expression ) {
        if ( expression.length == 0 ) {
            throw 'Greater/lower expression void.';
        }

        var segments = new ExpressionTokenizer( expression, EXPRESSION_DELIMITER, false );
        if ( segments.countTokens() != 2 ) {
            throw 'Wrong number of elements, greater/lower expressions only support two.';
        }
        
        var segment1 = segments.nextToken().trim();
        var number1 = numericLiteral(
                evaluate( scope, segment1 ) );
        if ( number1 === undefined ) {
            throw 'First number in expression "' + expression + '" is not a valid number.';
        }
        
        var segment2 = segments.nextToken().trim();
        var number2 = numericLiteral(
                evaluate( scope, segment2 ) );
        if ( number2 === undefined ) {
            throw 'Second number in expression "' + expression + '" is not a valid number.';
        }
        
        return {
            number1: number1,
            number2: number2
        };
    };

    var evaluateGreater = function( scope, expression ) {
        var numbers = evaluateGreaterOrLowerCommon( scope, expression );
        
        return numbers.number1 > numbers.number2;
    };
    
    var evaluateLower = function( scope, expression ) {
        var numbers = evaluateGreaterOrLowerCommon( scope, expression );
        
        return numbers.number1 < numbers.number2;
    };
    
    var evaluateOr = function( scope, exp ) {
        
        var expression = exp.trim();
        
        if ( expression.length == 0 ) {
            throw 'OR expression void.';
        }

        var segments = new ExpressionTokenizer( expression, EXPRESSION_DELIMITER, false );
        if ( segments.countTokens() == 1 ) {
            throw 'Only one element in OR expression, please add at least one more.';
        }
        
        while ( segments.hasMoreTokens() ) {
            if ( evaluateBoolean(
                    scope, 
                    segments.nextToken().trim() ) ){
                return true;
            }
        }

        return false;
    };
    
    var evaluateAnd = function( scope, exp ) {
        
        var expression = exp.trim();
        
        if ( expression.length == 0 ) {
            throw 'AND expression void.';
        }

        var segments = new ExpressionTokenizer( expression, EXPRESSION_DELIMITER, false );
        if ( segments.countTokens() == 1 ) {
            throw 'Only one element in AND expression, please add at least one more.';
        }
        
        while ( segments.hasMoreTokens() ) {
            if ( ! evaluateBoolean(
                    scope, 
                    segments.nextToken().trim() ) ){
                return false;
            }
        }

        return true;
    };
    
    var evaluateCond = function( scope, exp ) {
        
        var expression = exp.trim();
        
        if ( expression.length == 0 ) {
            throw 'Cond expression void.';
        }
        
        var segments = new ExpressionTokenizer( expression, EXPRESSION_DELIMITER, false );
        if ( segments.countTokens() != 3 ) {
            throw '3 element are needed in cond expression.';
        }
        
        // Evaluate first expression
        var segment = segments.nextToken().trim();
        var fistExpressionResult = evaluateBoolean( scope, segment );
        
        // If true, evaluate second expression
        segment = segments.nextToken().trim();
        if ( fistExpressionResult ){
            return evaluate( scope, segment );
        }

        // If false, evaluate third expression
        segment = segments.nextToken().trim();
        return evaluate( scope, segment );
    };
    /*
    var isArray = function ( varToTest ){
        return Object.prototype.toString.call( varToTest ) === '[object Array]';
    }*/
    
    var evaluateArithmetic = function( scope, exp, mathOperation ) {   
        var expression = exp.trim();

        if ( expression.length == 0 ) {
            throw mathOperation + " expression void.";
        }
        
        var segments = new ExpressionTokenizer( expression, EXPRESSION_DELIMITER, false );

        // Evaluate segments
        var result = 0;
        var c = 0;
        var value;
        
        while ( segments.hasMoreTokens() ) {
            var segment = segments.nextToken().trim();
            var evaluated = evaluate( scope, segment );
            
            //if ( isArray( evaluated ) ){
            if ( $.isArray( evaluated ) ){ 
                
                // Process array of numeric literals
                for ( var i = 0; i < evaluated.length; i++ ) {
                    value = numericLiteral( evaluated[i] );
                    
                    if ( value === undefined ) {
                        throw "Error trying doing math operation, value '" + value 
                                + "' is not a valid number in expression '" + mathOperation + ' ' + expression + "'";
                    }
                    
                    if ( c++ == 0 ){
                        result = value;
                        continue;
                    }
                    
                    result = evaluateArithmeticItem( result, value, mathOperation );
                }
                
                continue;
            }
            
            // Process numeric literal
            value = numericLiteral( evaluated );
            
            if ( value === undefined ) {
                throw "Error trying doing math operation, value '" + value 
                        + "' is not a valid number in expression '" + mathOperation + ' ' + expression + "'";
            }
    
            if ( c++ == 0 ){
                result = value;
                continue;
            }

            result = evaluateArithmeticItem( result, value, mathOperation );
        }
        
        if ( c < 2 ) {
            throw 'Only one element in expression "' + mathOperation + ' ' + expression + '", please add at least one more.';
        }
        
        return result;
    };
    
    var evaluateArithmeticItem = function( result, value, mathOperation ) {
        
        switch ( mathOperation ) {
        case EXPR_ADD:
            result += value;
            break;
        case EXPR_SUB:
            result -=  value;
            break;
        case EXPR_MUL:
            result *=  value;
            break;
        case EXPR_DIV:
            result /=  value;
            break;
        case EXPR_MOD:
            result %=  value;
            break;
        default:
            throw "The evaluateArithmetic method can't handle '" + mathOperation + "' math operation";
        }
        
        return result;
    };
    
    // follows the dot notation path to find an object within an object:
    // obj["a"]["b"]["1"] = c;
    /*
    var evaluateDefault = function( obj, expression ) {

        // if fully qualified path is at top level: obj["a.b.d"] = c
        if((x = obj[expression])) return (typeof x == "function") ? x.call(obj, expression) : x;

        expression = expression.split(".");
        
        if ( expression[0] == 'repeat' ){
            return evaluateRepeatExpression( scope, expression[1], expression[2] );
        }
        
        x = 0;
        while(expression[x] && (lastObj = obj) && (obj = obj[expression[x++]]));
        return (typeof obj == "function") ? obj.call(lastObj, expression.join(".")) : obj;
    }*/
    var evaluateDefault = function( scope, expression ) {

        // if fully qualified path is at top level: obj["a.b.d"] = c
        var value = scope.get( expression );
        if ( value ){
            return typeof value == 'function'?
                   value.call( value, expression ) : 
                   value;
        }

        var expressionItem = expression.split( '.' );
        
        if ( expressionItem[0] == 'repeat' ){
            return evaluateRepeatExpression( scope, expressionItem[1], expressionItem[2] );
        }
        
        var x = 0;
        var lastValue;
        var finish = ! expressionItem[ x ];
        while( ! finish ){
            lastValue = value;
            value = x == 0? 
                    scope.get( expressionItem [ x++ ] ):
                    value[ expressionItem [ x++ ] ];
            finish = ! expressionItem[ x ] || ! value;
        }
        
        return typeof value == 'function'? 
               value.call( lastValue, expressionItem.join( '.' ) ) : 
               value;
    };
    
    var evaluateRepeatExpression = function( scope, name, method ) {
        var loop = loopManager.get( scope, name );
        
        if ( ! loop ){
            throw 'Loop "' + name + '" not found.';
        }
        
        return ( loop[ method ] )();
    };
    
    var evaluateString = function( scope, expression ) {
        var STATE_SCANNING = 0;
        var STATE_AT_DOLLAR = 1;
        var STATE_IN_EXPRESSION = 2;
        var STATE_IN_BRACKETED_EXPRESSION = 3;

        var result = '';
        var subexpression = '';
        var state = STATE_SCANNING;

        for ( var i = 0; i < expression.length; i++) {
            var ch = expression.charAt( i );

            switch ( state ) {
            // In the string part of the expression
            case STATE_SCANNING:
                // Found a dollar sign
                if (ch == '$') {
                    state = STATE_AT_DOLLAR;
                }
                // Just keep appending to result buffer
                else {
                    result += ch;
                }
                break;

            // Next character after dollar sign
            case STATE_AT_DOLLAR:
                // An escaped dollar sign
                if ( ch == '$' ) {
                    result += '$';
                    state = STATE_SCANNING;
                }

                // Beginning of a bracketed expression
                else if ( ch == '{' ) {
                    subexpression = '';
                    state = STATE_IN_BRACKETED_EXPRESSION;
                }

                // Beginning of a non bracketed expression
                else {
                    subexpression += ch;
                    state = STATE_IN_EXPRESSION;
                }
                break;

            // In subexpression
            case STATE_IN_BRACKETED_EXPRESSION:
            case STATE_IN_EXPRESSION:
                // Check for end
                if ( ( state == STATE_IN_BRACKETED_EXPRESSION && ch == '}' )
                        || ( state == STATE_IN_EXPRESSION && ch == ' ' ) ) {
                    result += evaluate( scope, subexpression );
                    if ( state == STATE_IN_EXPRESSION ) {
                        result += ch;
                    }
                    state = STATE_SCANNING;
                }

                // Keep appending to subexpression
                else {
                    subexpression += ch;
                }
            }
        }

        // Ended in unclosed bracket
        if ( state == STATE_IN_BRACKETED_EXPRESSION ) {
            throw "Unclosed left curly brace: " + expression;
        }
        // Ended at expression
        else if ( state == STATE_IN_EXPRESSION ) {
            result += evaluate( scope, subexpression );
        }

        return result;
    };
    
    var evaluatePath = function( scope, exp ) {
    
        var expression = exp;
    
        // Blank expression evaluates to blank string
        if ( expression.trim().length == 0 ) {
            return '';
        }

        var segments = new ExpressionTokenizer( expression, PATH_DELIMITER, false );
        if ( segments.countTokens() == 1 ) {
            return evaluatePathSegment( expression, scope );
        }

        var result;
        var exception;
        while ( segments.hasMoreTokens() ) {
            try {
                var segment = segments.nextToken().trim();
                result = evaluate( scope, segment );
                if ( result != null ) {
                    return result;
                }
            } catch( e ) {
                exception = e;
            }
        }
        
        if ( exception ) {
            throw exception;
        }
        
        return null;
    };
    
    var evaluatePathSegment = function( expression, scope ) {
    
        // Blank expression evaluates to blank string
        if ( expression.length == 0 ) {
            return '';
        }
    
        // Evaluate first token
        var path = new ExpressionTokenizer( expression, PATH_SEGMENT_DELIMITER, false );
        var token = path.nextToken().trim();
        var result = evaluateFirstPathToken( token, scope );
    
        // Traverse the path
        while ( path.hasMoreTokens() ) {
            // Only last element can be null
            if ( result === null ) {
                throw token + ' in "' + expression + '" is null';
            }
        
            token = path.nextToken().trim();
            result = evaluateNextPathToken( result, token, scope );
        }

        return result;
    };
    
    var evaluateFirstPathToken = function( tok, scope ) {
    
        var token = tok;
    
        // Separate identifier from any array accessors
        var arrayAccessor;
        var bracket = findArrayAccessor( token );
        //if ( bracket != -1 && bracket != 0 ) {
        if ( bracket > 0 ) {
            arrayAccessor = token.substring( bracket ).trim();
            token = token.substring( 0, bracket ).trim();
        }

        // First token must come from dictionary or be a literal

        // First see if it's a string literal
        var result = stringLiteral( token );
    
        // If it's not, try to see if it's a number
        if ( result === undefined ) {
            result = numericLiteral( token );
        
            // Maybe it's a boolean literal
            if ( result === undefined ) {
                result = booleanLiteral( token );
                
                // An array?
                if ( result === undefined ){
                    result = arrayExpression( scope, token );

                    // A function call?
                    if ( result === undefined ) {                         
                        var leftParen = token.indexOf( '(' );
                        if ( leftParen != -1 ) {
                            if ( ! endsWith( token, ')' ) ) {
                                throw 'Syntax error: bad function call: ' + token;
                            }
                            var functionName = token.substring( 0, leftParen ).trim();
                            var arguments = token.substring( leftParen + 1, token.length - 1 );
                            result = evaluateFunctionCall( functionName, arguments, scope );
                        }
                        
                        // Must be an object in dictionary
                        if ( result === undefined ) {
                            result = evaluateDefault( scope, token );
                        }
                    }
                }
            }
        }
        
        if ( arrayAccessor !== undefined ) {
            result = evaluateArrayAccess( token, result, arrayAccessor, scope );
        }

        return result;
    };
    
    var evaluateNextPathToken = function( parent, tok, scope ){
        var token = tok;
    
        // Separate identifier from any array accessors
        var arrayAccessor;
        var bracket = findArrayAccessor( token );
        if ( bracket != -1 ) {
            arrayAccessor = token.substring( bracket ).trim();
            token = token.substring( 0, bracket ).trim();
        }

        // Element is a method or property of parent
        var result;
    
        // Test for indirection
        if ( token.charAt( 0 ) == '?' ) {
            var indirectToken = evaluateFirstPathToken( token.substring( 1 ), scope );
            result = evaluateNextPathToken( parent, indirectToken, scope );
        } else {
            // A method call?
            var leftParen = token.indexOf( '(' );
            if ( leftParen != -1 ) {
                if ( ! endsWith( token, ')' ) ) {
                    throw 'Syntax error: bad method call: ' + token;
                }
                var methodName = token.substring( 0, leftParen ).trim();
                var arguments = token.substring( leftParen + 1, token.length - 1 );
                result = evaluateMethodCall( parent, methodName, arguments, scope );
            } else {
                // A property
                result = getProperty( parent, token );
            }
        }
    
        if ( arrayAccessor !== undefined ) {
            result = evaluateArrayAccess( token, result, arrayAccessor, scope );
        }

        return result;
    };
    
    var getArgumentsFromString = function( argumentString, scope ) {
        // Parse and evaluate arguments; then push them to an array
        var argumentTokens = new ExpressionTokenizer( argumentString, ',', true );
        var arguments = [];
        while ( argumentTokens.hasMoreTokens() ) {
            var argumentExpression = argumentTokens.nextToken().trim();
            arguments.push( 
                    evaluate( scope, argumentExpression ) );
        }
        
        return arguments;
    };
    
    var evaluateMethodCall = function( parent, methodName, argumentString, scope ) {
        var arguments = getArgumentsFromString( argumentString, scope );
        return parent[ methodName ].apply( parent, arguments );
    };
    
    var evaluateFunctionCall = function( functionName, argumentString, scope ) {
        var arguments = getArgumentsFromString( argumentString, scope );
        var element = scope.get( functionName );
        return ! element? undefined: element.apply( element, arguments );
    };
    
    var booleanLiteral = function( expression ) {
        
        if ( 'true' === expression ) {
            return true;
        }
        if ( 'false' === expression ) {
            return false;
        }
        return undefined;
    };
    
    var arrayExpression = function( scope, expression ) {
        
        if ( expression.charAt( 0 ) !== '[' || expression.charAt( expression.length - 1 ) !==  ']' ) {
            return undefined;
        }

        var arrayExp = expression.substring( 1, expression.length - 1 );
        var result = [];
        var segments = new ExpressionTokenizer( arrayExp, EXPRESSION_DELIMITER, true );
        
        while ( segments.hasMoreTokens() ) {
            var segment = segments.nextToken().trim();
            var range = rangeExpression( scope, segment );
            
            if ( range ){
                result = result.concat( range );
            } else {
                var value = evaluate( scope, segment );
                //if ( value !== undefined ) {
                result.push( value );
                //}
            }
        }
        
        return result;
    };
    
    var rangeExpression = function( scope, exp ){

        if ( ! exp ) {
            return undefined;
        }

        var RANGE_DEFAULT_START = 0;
        var RANGE_DEFAULT_STEP = 1;
        
        var expression = exp.trim();
        
        var segments = new ExpressionTokenizer( expression, INTERVAL_DELIMITER, false );
        
        var numberOfTokens = segments.countTokens();
        if ( numberOfTokens != 2 && numberOfTokens != 3 ) {
            return undefined;
        }
        
        // Evaluate start expression if any
        var start = segments.nextToken().trim();
        var startExpressionResult = start == ''? RANGE_DEFAULT_START: evaluate( scope, start );
        
        // Evaluate end expression
        var end = segments.nextToken().trim();
        var endExpressionResult = evaluate( scope, end );
        
        // Evaluate step expression if any
        var stepExpressionResult = RANGE_DEFAULT_STEP;
        if ( numberOfTokens == 3 ){
            var step = segments.nextToken().trim();
            stepExpressionResult = evaluate( scope, step );
        }
        
        return evaluateRange({
            start: startExpressionResult,
            end: endExpressionResult,
            step: stepExpressionResult
        });
    };
    
    var evaluateRange = function( range ){
        
        // Check if the range is valid
        if ( numericLiteral( range.start ) === undefined 
                || numericLiteral( range.end ) === undefined
                || numericLiteral( range.step ) === undefined ){
            return undefined;
        }
        
        // The range is valid, evaluate it
        var result = [];
        var forward = range.step > 0; 
        
        var c = range.start;
        while( forward? c <= range.end: c >= range.end ){
            result.push( c );
            c += range.step;
        }
        
        return result;
    };
    
    var stringLiteral = function( expression ) {
        
        if ( expression.charAt( 0 ) === "'" && expression.charAt( expression.length - 1 ) ===  "'" ) {
            return expression.substring( 1, expression.length - 1 );
        }
        
        return undefined;
    };
    
    var numericLiteral = function( expression ) {
        if ( isFinite( expression ) ){
            var integerValue = parseInt( expression );
            if ( integerValue == expression ){
                return integerValue;
            }
            
            var floatValue = parseFloat( expression );
            if ( floatValue == expression ){
                return floatValue;
            }
        }
        
        return undefined;
    };
    
    var findArrayAccessor = function( token ) {
        var SCANNING = 0;
        var IN_PAREN = 1;
        var IN_QUOTE = 2;
        
        var length = token.length;
        var state = SCANNING;
        var parenDepth = 0;
        for ( var i = 0; i < length; i++ ) {
            var ch = token.charAt( i );
            switch( state ) {
            case IN_PAREN:
                if ( ch == ')' ) {
                    parenDepth--;
                    if ( parenDepth == 0 ) {
                        state = SCANNING;
                    }
                }
                else if ( ch == '(' ) {
                    parenDepth++;
                }
                break;
                
            case IN_QUOTE:
                if ( ch == '\'' ) {
                    state = SCANNING;
                }
                break;
                
            case SCANNING:
                if ( ch == '\'' ) {
                    state = IN_QUOTE;
                }
                else if ( ch == '(' ) {
                    parenDepth++;
                    state = IN_PAREN;
                }
                else if ( ch == '[' ) {
                    return i;
                }
            }
        }
        
        return -1;
    };
    
    var evaluateArrayAccess = function( tok, res, acc, scope ) {
        var result = res;
        var token = tok;
        var accessor = acc;

        // Array accessor must begin and end with brackets
        var close = accessor.indexOf( ']' );
        if ( accessor.charAt( 0 ) != '[' || close == -1 ) {
            throw 'Bad array accessor for ' + token + ': '  + accessor;
        }
        
        // Array accessor must operate on an array
        if( ! $.isArray( result ) ) {
            throw token + ' is not an array';
        }

        array = result;
        var index = evaluate( scope, accessor.substring( 1, close ) );
        index = numericLiteral( index );
        if ( index === undefined ) {
            throw 'Array index must be an integer';
        }
        result = array[ index ];

        // Continue evaluating array access for multidimensional arrays
        close++;
        if ( accessor.length > close ) {
            token += accessor.substring( 0, close );
            accessor = accessor.substring( close );
            result = evaluateArrayAccess( token, result, accessor, scope );
        }
        
        return result;
    };
    
    var removeParenthesisIfAny = function( token ){
        var effectiveToken = token.trim();
        
        if ( effectiveToken == '' ){
            return effectiveToken;
        }
        
        if ( effectiveToken.charAt(0) == '(' ){
            return effectiveToken.substring( 1, effectiveToken.lastIndexOf( ')' ) ).trim();     
        }
        
        return effectiveToken;
    };
    
    var endsWith = function( str, suffix ) {
        return str.indexOf( suffix, str.length - suffix.length ) !== -1;
    };

    return {
        evaluateToNotNull: evaluateToNotNull,
        evaluate: evaluate,
        evaluateBoolean: evaluateBoolean,
        removeParenthesisIfAny: removeParenthesisIfAny,
        endsWith: endsWith
    };
})();
