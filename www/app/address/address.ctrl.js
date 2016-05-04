(function() {
  angular.module('starter').controller('AddressCtrl', AddressCtrl);

  AddressCtrl.$inject = ['starterConfig', 'utilService', '$scope', '$ionicPopover'];

  function AddressCtrl(sc, utilService, $scope, $ionicPopover) {
    // Variables section
    var addressCtrl = this;
    var logger = utilService.getLogger();
    logger.debug("AddressCtrl starts");
    addressCtrl.areaArr = ["Vashi", "Ghansoli", "Tubhre"];
    addressCtrl.area = null;
    addressCtrl.cityArr = ["Mumbai"];

    // Functions section
    addressCtrl.hideAreaPopover = hideAreaPopover;
    addressCtrl.showAreaPopover = showAreaPopover;
    addressCtrl.getArea = getArea;

    $ionicPopover.fromTemplateUrl("app/address/area-po.html", {
      scope: $scope
    }).then(function(areaPopover) {
      $scope.areaPopover = areaPopover;
    });

    function hideAreaPopover($event) {
      logger.debug("hideAreaPopover function");
      $scope.areaPopover.hide($event);
    }

    function showAreaPopover($event) {
      logger.debug("showAreaPopover function");
      $scope.areaPopover.show($event);
    }

    function getArea(area) {
      logger.debug("getArea function");
      logger.debug("area: " + area);
      addressCtrl.area = area;
      addressCtrl.hideAreaPopover();
    }

    logger.debug("AddressCtrl ends");
  }
})();
