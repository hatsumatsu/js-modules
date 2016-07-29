/**
 * Debug
 * logging and stuff
 */
var Debug = ( function() {

    var settings = {
        keyboardKeys: {
            toggle: 68 // D
        }
    }

    var state = {
        local:  false,
        active: true,
    }

    var init = function() {
        state.local = ( location.href.indexOf( 'local' ) > -1 ) ? true : false;
        state.active = state.local;

        bindEventHandlers();
    }

    var bindEventHandlers = function() {
        window.addEventListener( 'keyup', function( event ) {
            if( event.keyCode === settings.keyboardKeys.toggle || event.which === settings.keyboardKeys.toggle ) {
                state.active = !state.active;
                console.log( 'Toggle debug mode', state.active );
            }
        } );
    }

    var log = function() {
        if( state.local || state.active ) {
            console.log.apply( console, arguments );
        }
    }

    return {
        init: function() { init(); },
        log:  log
    }

} )();

Debug.init();
