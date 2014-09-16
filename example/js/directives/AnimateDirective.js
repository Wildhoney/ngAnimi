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
                    left: "300px",
//                    transform: "rotate(270deg) translateY(0px) scale(.3)",
//                    borderRadius: "50px",
//                    background: "orange",
////                    offset: 1,
//                    opacity: 0
                };

                animi.transition(element, style, 1000).then(function then() {

                    console.log('Here')

                });

            }

        };

    });

})(window.angular);