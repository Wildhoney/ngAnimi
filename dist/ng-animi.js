(function Animi($angular) {

    "use strict";

    // Houston, wir haben ein Problem!
    var app = $angular.module('ngAnimi', []);

    /**
     * @factory animi
     * @author Adam Timberlake <adam.timberlake@gmail.com>
     * @link https://github.com/Wildhoney/ngAnimi
     */
    app.factory('animi', ['$window', '$timeout', '$q', function animiFactory($window, $timeout, $q) {

        var factory = {};

        /**
         * Milliseconds to wait before we attempt to retrieve the computed styles for the element, since
         * CSS styles need a moment to be applied.
         *
         * @constant DEFER_MILLISECONDS
         * @type {Number}
         */
        factory.DEFER_MILLISECONDS = 1;

        /**
         * @method throwException
         * @param message {String}
         * @return {void}
         */
        factory.throwException = function throwException(message) {
            throw "ngAnimi: " + message + ".";
        };

        /**
         * @method transition
         * @param element {Object}
         * @param styleDeclaration {Object}
         * @param durationMilliseconds {Number}
         * @return {$q.promise}
         */
        factory.transition = function transition(element, styleDeclaration, durationMilliseconds) {

            var defer          = $q.defer(),
                nativeElement  = element,
                angularElement = $angular.element(element),
                initialStyles  = {};

            $timeout(function timeout() {

                if (nativeElement instanceof $angular.element) {

                    // Convert the element to a native object for the purpose of obtaining its styles.
                    nativeElement = element[0];

                }

                for (var property in styleDeclaration) {

                    if (styleDeclaration.hasOwnProperty(property)) {

                        // Iterate over the styles to define the initial styles to transition from, which should
                        // be the same as those defined in the stylesheet -- if it exists, otherwise we'll use the
                        // browser computed styles.
                        initialStyles[property] = $window.getComputedStyle(nativeElement)[property];

                        if (initialStyles[property] === 'auto') {
                            factory.throwException('Property "auto" for "' + property + '" results in no animation');
                        }

                    }

                }

                // Perform the animation using the fancy new `animate` method!
                var animation = nativeElement.animate([initialStyles, styleDeclaration], durationMilliseconds);

                /**
                 * Invoked once the animation has completed.
                 *
                 * @method onFinish
                 * @return {void}
                 */
                animation.onfinish = function onFinish() {

                    // Define the CSS so that it's not reverted by the native `animate` method.
                    angularElement.css(styleDeclaration);
                    defer.resolve(styleDeclaration);

                };

            }, factory.DEFER_MILLISECONDS);

            return defer.promise;

        };

        return factory;

    }]);

})(window.angular);