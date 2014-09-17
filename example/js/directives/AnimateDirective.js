(function($angular) {

    /**
     * @directive Animate
     */
    $angular.module('animiApp').directive('animate', function AnimateDirective(animi) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: 'EA',

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                var style = {
                    transform: "rotate(270deg) translateY(0px) scale(.3)",
                    opacity: 0,
                    borderRadius: "50px"
                };

//                var timing = { duration: 1500, iterations: 1, delay: 300 };

                animi.transition(element, style, 1500).then(function then() {

                    console.log('Here')

                });

            }

        };

    });

})(window.angular);