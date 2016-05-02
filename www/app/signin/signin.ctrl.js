(function() {
  angular.module('starter').controller('SigninCtrl', SigninCtrl);

  SigninCtrl.$inject = ['starterConfig', 'utilService'];

  function SigninCtrl(starterConfig, utilService) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("SigninCtrl start");

    var signinCtrl = this;
    signinCtrl.userName;
    signinCtrl.password;
    // Functions section
    signinCtrl.signin = signin;

    function signin() {
      logger.debug("signin starts");

      /*  $cordovaOauth.google("CLIENT_ID_HERE", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
              console.log(JSON.stringify(result));
              window.localStorage.setItem("access_token", result.access_token);
          }, function(error) {
              console.log(error);
          });*/

      //dbService.dbQuery("insert into user values(?, ?)", [signinCtrl.userName, signinCtrl.password]);
      //dbService.dbQuery("insert into test values(?, ?)", ['Ash', 'Test']);

      dbService.dbQuery("SELECT * FROM user where username = ? and password = ?", [signinCtrl.userName, signinCtrl.password])
        .then(function(result) {
          logger.debug("result: " + JSON.stringify(result.rows));
          if(result.rows.length == 1){
            logger.debug("Logged in");
          }else {
            logger.debug("Logged in failed");
          }
          /*for (var i = 0; i < result.rows.length; i++) {
            logger.debug(result.rows.item(i));
          }*/
        });
      logger.debug("signin ends");
    }

    logger.debug("SigninCtrl end");
  }
})();
