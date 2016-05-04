(function() {
  angular.module('starter').controller('SigninCtrl', SigninCtrl);

  SigninCtrl.$inject = ['starterConfig', 'utilService', '$state'];

  function SigninCtrl(sc, utilService, $state) {
    // Variables section
    var logger = utilService.getLogger();
    logger.debug("SigninCtrl start");

    var signinCtrl = this;
    signinCtrl.isAddressPresent = false;

    // Functions section
    signinCtrl.signin = signin;

    function signin() {
      logger.debug("signin starts");

      if (signinCtrl.isAddressPresent) {
        $state.go(sc.hfStates.placeorder);
      }else{
        $state.go(sc.hfStates.address);
      }

      logger.debug("signin ends");
    }

    logger.debug("SigninCtrl end");
  }
})();
