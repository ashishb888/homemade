(function() {
  angular.module('starter').controller('SignupCtrl', SignupCtrl);

  SignupCtrl.$inject = ['$state', 'starterConfig', 'utilService', 'signupService'];
  function SignupCtrl($state, starterConfig, utilService, signupService) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("SignupCtrl start");

    var signupCtrl = this;
    // Functions section
    signupCtrl.signup = signup;

    function signup() {
      try {
        logger.debug("signup starts");

        if (!utilService.isAppOnlineService()) {
            utilService.retryService(screenTitle, screenState);
            return;
        }

        var promise = signupService.signup(signupCtrl.sf);
        promise.then(function(sucResp){
            try {
                var resp = sucResp.data;

                if (resp.status !== SUCCESS) {
                    utilService.showAlert(resp);
                    return;
                }
            } catch (exception) {
                logger.debug("exception: " + exception);
            }
        }, function(errResp){
        });

        logger.debug("signup ends");
      } catch (exception) {
        logger.debug("exception: " + exception);
      }
    }

    logger.debug("SignupCtrl end");
  }
})();
