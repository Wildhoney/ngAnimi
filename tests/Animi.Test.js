(function($angular) {

    beforeEach(module('ngAnimi'));

    describe('Animi', function() {

        it('Should be able to throw an exception;', function() {

            var animi = new Animi();

            expect(function() {
                animi.throwException('Unable to do this and that');
            }).toThrow('ngAnimi: Unable to do this and that.');

        });

        it('Should be able to resolve to a native element;', function() {

            var animi          = new Animi(),
                nativeElement  = document.createElement('input'),
                angularElement = $angular.element(nativeElement);

            expect(angularElement instanceof $angular.element).toBeTruthy();
            expect(nativeElement instanceof $angular.element).toBeFalsy();
            expect(animi.resolveToNative(angularElement) instanceof $angular.element).toBeFalsy();
            expect(animi.resolveToNative(nativeElement) instanceof $angular.element).toBeFalsy();

        });

        it('Should be able to obtain the default styles for an element;', function() {

            var animi            = new Animi(),
                nativeElement    = document.createElement('section'),
                styleDeclaration = {
                    backgroundColor: 'red',
                    left: '0px'
                };

            // Define the styles which the `getDefaultStyles` should pick up on.
            nativeElement.style.left            = '0px';
            nativeElement.style.backgroundColor = 'rgb(255, 0, 0)';

            var defaultStyles = animi.getDefaultStyles(nativeElement, styleDeclaration);
            expect(defaultStyles.left).toEqual('0px');
            expect(defaultStyles.backgroundColor).toEqual('rgb(255, 0, 0)');

            // An exception should be thrown if any property is defined as "auto".
            nativeElement.style.left = 'auto';
            expect(function() {
                animi.getDefaultStyles(nativeElement, styleDeclaration);
            }).toThrow('ngAnimi: Property "auto" for "left" results in no animation.');

        });

        it('Should be able to transition and persist the style;', function() {

            var animi            = new Animi(),
                transition       = new Animi.Transition(),
                nativeElement    = document.createElement('section'),
                styleDeclaration = { left: '50px' },
                memberObject     = {};

            // Define the styles for the element.
            nativeElement.style.left = '20px';

            // Mock the `animation` method.
            nativeElement.animate = function() {
                return memberObject;
            };
            spyOn(nativeElement, 'animate').andCallThrough();

            transition.transition(nativeElement, styleDeclaration, 100, function() {
                expect(true).toBe(true);
            });

            expect(nativeElement.animate).toHaveBeenCalled();

            // Manually invoke the `onfinish` method as defined by the `transition` function.
            expect(typeof memberObject.onfinish).toBe('function');
            expect(nativeElement.style.left).toEqual('20px');
            memberObject.onfinish();
            expect(nativeElement.style.left).toEqual('50px');

        });

    });

})(window.angular);