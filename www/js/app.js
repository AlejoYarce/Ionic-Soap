angular.module('ionic-soap', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('MainCtrl', function($scope, testService) {

  testService.GetCitiesByCountry('colombia').then(
    function(response) {
      var x2js = new X2JS();
      var jsonObj = x2js.xml_str2json( response );
      $scope.countries = jsonObj.NewDataSet.Table;
    }
  );

})

.factory("testService", ['$soap',function($soap){
    var base_url = "http://www.webservicex.com/globalweather.asmx";
    // var base_url = "http://201.232.103.32:8080/wsTurnosUltracem/srvPlanta.svc";

    return {
        GetCitiesByCountry: function(countryName){
            return $soap.post(base_url,"GetCitiesByCountry", {CountryName: countryName});
        }
    }
}])

.factory("$soap",['$q',function($q){
  return {
    post: function(url, action, params){
      var deferred = $q.defer();
      
      //Create SOAPClientParameters
      var soapParams = new SOAPClientParameters();
      for(var param in params){
        soapParams.add(param, params[param]);
      }
      
      //Create Callback
      var soapCallback = function(e){
        if(e.constructor.toString().indexOf("function Error()") != -1){
          deferred.reject("An error has occurred.");
        } else {
          deferred.resolve(e);
        }
      }
      
      SOAPClient.invoke(url, action, soapParams, true, soapCallback);

      return deferred.promise;
    }
  }
}]);

