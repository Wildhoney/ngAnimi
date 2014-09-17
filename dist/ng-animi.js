(function($angular) {

    "use strict";

    /**
     * @factory animi
     * @author Adam Timberlake <adam.timberlake@gmail.com>
     * @link https://github.com/Wildhoney/ngAnimi
     */
    $angular.module('ngAnimi').factory('animi', ['$window', '$timeout', '$q',

    function animiFactory($window, $timeout, $q) {

        var factory = {};

        /**
         * @property class
         * @type {Animi.Transition}
         */
        factory.class = new $window.Animi.Transition();

        /**
         * @method transition
         * @param element {Object}
         * @param styleDeclaration {Object}
         * @param durationMilliseconds {Number}
         * @return {$q.promise}
         */
        factory.transition = function transition(element, styleDeclaration, durationMilliseconds) {

            var defer = $q.defer();

            $timeout(function timeout() {

                // Transition the element, and then resolve the promise once it is has finished.
                factory.class.transition(element, styleDeclaration, durationMilliseconds, function finished() {
                    defer.resolve();
                });

            }, 1);

            return defer.promise;

        };

        return factory;

    }]);

})(window.angular);

(function Animi($window, $angular) {

    "use strict";

    // Houston, wir haben ein Problem!
    $angular.module('ngAnimi', []);

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

(function($angular) {

    "use strict";

    /**
     * @directive ngAnimiHide
     * @author Adam Timberlake <adam.timberlake@gmail.com>
     * @link https://github.com/Wildhoney/ngAnimi
     */
    $angular.module('ngAnimi').directive('ngAnimiHide', function ngAnimiHide(animi) {
       
        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: 'A',

            /**
             * @property scope
             * @type {Object}
             */
            scope: {
                model: '=ngAnimiHide'
            },

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                scope.$watch('model', function modelChanged() {

                    animi.transition(element, { backgroundColor: 'green', opacity: 0 }, 1000).then(function then() {
                        element.addClass('ng-hide');
                    });

                });

            }

        }
        
    });

})(window.angular);

(function AnimiProcedures($window) {

    "use strict";

    /**
     * @module Animi
     * @submodule Procedures
     * @constructor
     */
    $window.Animi.Procedures = function() {};

})(window);

(function AnimiProcedures($window, $angular) {

    "use strict";

    /**
     * @module Animi
     * @submodule Transition
     * @extends Animi
     * @constructor
     */
    var Transition = $window.Animi.Transition = function() {

        /**
         * @method transition
         * @param element {Object}
         * @param styleDeclaration {Object}
         * @param durationMilliseconds {Number}
         * @param done {Function}
         * @return {void}
         */
        this.transition = function transition(element, styleDeclaration, durationMilliseconds, done) {

            var nativeElement    = this.resolveToNative(element),
                angularElement   = $angular.element(element),
                getDefaultStyles = this.getDefaultStyles;

            // Perform the animation using the fancy new `animate` method!
            var defaultStyles = getDefaultStyles(nativeElement, styleDeclaration),
                animation     = nativeElement.animate([defaultStyles, styleDeclaration], durationMilliseconds);

            /**
             * Invoked once the animation has completed.
             *
             * @method onFinish
             * @return {void}
             */
            animation.onfinish = function onFinish() {

                // Define the CSS so that it's not reverted by the native `animate` method.
                angularElement.css(styleDeclaration);
                done();

            };

        };

    };

    /**
     * @property prototype
     * @type {Animi}
     */
    Transition.prototype = new $window.Animi();

})(window, window.angular);