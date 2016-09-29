/**
 * Gyro
 * requires fulltilt.js https://github.com/adtile/Full-Tilt
 */
var Debug = Gyro = ( function() {

    var settings = {
        calibration: {
            alpha: 0,
            beta: 0,
            gamma: 0
        },
        orientation: {
            alpha: 0,
            beta: 0,
            gamma: 0
        },
        orientationRelative: {
            alpha: 0,
            beta: 0,
            gamma: 0
        },
        maxAngle: 30
    }

    var state = {
        supported: false
    }

    var init = function() {
        Debug.log( 'Gyro.init()' );

        if( !FULLTILT ) {
            Debug.log( 'fulltilt.js was not found...' );
            return false;
        }

        var promise = FULLTILT.getDeviceOrientation();

        promise
            .then( function( controller ) {
                settings.controller = controller;
                state.supported = true;

                calibrate();
            } )
            .catch( function( message ) {
                state.supported = false;
            } );

        bindEventhandlers();
    }

    var bindEventhandlers = function() {
        $( document )
            .on( 'viewport/loop', function() {
                onLoop();
            } );
    }

    var onLoop = function() {
        if( !state.supported ) {
            return false;
        }

        var orientation = settings.controller.getScreenAdjustedEuler();

        var alpha = orientation.alpha - settings.calibration.alpha;
        alpha = Math.min( Math.max( alpha, ( settings.maxAngle * -1 ) ), settings.maxAngle );

        var beta = orientation.beta - settings.calibration.beta;
        beta = Math.min( Math.max( beta, ( settings.maxAngle * -1 ) ), settings.maxAngle )

        var gamma = orientation.gamma - settings.calibration.gamma;
        gamma = Math.min( Math.max( gamma, ( settings.maxAngle * -1 ) ), settings.maxAngle )

        settings.orientation = {
            alpha: alpha,
            beta: beta,
            gamma: gamma
        }

        settings.orientationRelative = {
            alpha: settings.orientation.alpha / settings.maxAngle,
            beta: settings.orientation.beta / settings.maxAngle,
            gamma: settings.orientation.gamma / settings.maxAngle
        }
    }

    var calibrate = function() {
        Debug.log( 'Gyro.calibrate()' );

        if( !state.supported ) {
            return false;
        }

        var now = settings.controller.getScreenAdjustedEuler();
        settings.calibration.alpha= now.alpha;
        settings.calibration.beta = now.beta;
        settings.calibration.gamma = now.gamma;

        Debug.log( settings.calibration );
    }

    isSupported = function() {
        return state.supported;
    }

    getOrientation = function() {
        return settings.orientation;
    }

    getOrientationRelative = function() {
        return settings.orientationRelative;
    }

    return {
        init: function() { init(); },
        isSupported: function() { return isSupported(); },
        getOrientation: function() { return getOrientation(); },
        getOrientationRelative: function() { return getOrientationRelative(); }
    }
} )();


$( document ).ready( function() {
    Gyro.init();
} );
