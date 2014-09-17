(function Animi($window, $angular) {

    "use strict";

    // Find the Animi dependencies.
//    var Procedure = $window.Animi.Procedures;

    /**
     * @module Animi
     * @constructor
     */
    var AnimiModule = $window.Animi = function Animi() {

//        this.procedures = Procedure();

    };

    /**
     * @property prototype
     * @type {Object}
     */
    AnimiModule.prototype = {

        /**
         * Milliseconds to wait before we attempt to retrieve the computed styles for the element, since
         * CSS styles need a moment to be applied.
         *
         * @constant DEFER_MILLISECONDS
         * @type {Number}
         */
        DEFER_MILLISECONDS: 1,

        /**
         * @method throwException
         * @param message {String}
         * @return {void}
         */
        throwException: function throwException(message) {
            throw "ngAnimi: " + message + ".";
        },

        /**
         * @method resolveToNative
         * @param element {Object}
         * @return {Object}
         */
        resolveToNative: function resolveToNative(element) {

            if (element instanceof $angular.element) {

                // Convert the element to a native object for the purpose of obtaining its styles.
                element = element[0];

            }

            return element;

        },

        /**
         * @method getDefaultStyles
         * @param nativeElement {Object}
         * @param styleDeclaration {Object}
         * @return {Object}
         */
        getDefaultStyles: function getDefaultStyles(nativeElement, styleDeclaration) {

            var styles = {};

            for (var property in styleDeclaration) {

                if (styleDeclaration.hasOwnProperty(property)) {

                    // Iterate over the styles to define the initial styles to transition from, which should
                    // be the same as those defined in the stylesheet -- if it exists, otherwise we'll use the
                    // browser computed styles.
                    styles[property] = $window.getComputedStyle(nativeElement)[property];

                    if (styles[property] === 'auto') {
                        this.throwException('Property "auto" for "' + property + '" results in no animation');
                    }

                }

            }

            return styles;

        }

    };

})(window, window.angular);