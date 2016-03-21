angular.module('ionic-soap', ['ionic'])
/*.constant('ApiEndpoint', {
  url: 'http://localhost:8100/wsTurnosAgenda/srvAgendas.svc'
})*/
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

  $scope.showCities = function() {
    $scope.isUsers = false;
    $scope.isCities = true;
    $scope.users = [];
    $scope.cities = [];
    testService.GetCitiesByCountry('colombia').then(
      function(response) {
        var x2js = new X2JS();
        var jsonObj = x2js.xml_str2json( response );
        $scope.cities = jsonObj.NewDataSet.Table;
      }
    );
  };

  $scope.cleanData = function() {
    $scope.users = [];
    $scope.cities = [];
  }

  $scope.showUsers = function() {
    $scope.isCities = false;
    $scope.isUsers = true;
    $scope.cities = [];
    $scope.users = [];
    testService.AgendasUsuario(1).then(
      function(response) {
        var x2js = new X2JS();
        var jsonObj = x2js.xml_str2json( response );
        $scope.users = jsonObj.NewDataSet.Table;
      }
    );
  };

})

.factory("testService", ['$soap',function($soap) {
    var citiesUrl = "http://www.webservicex.com/globalweather.asmx";
    var usersUrl = "http://201.232.103.32:8080/wsTurnosAgenda/srvAgendas.svc";

    return {
        GetCitiesByCountry: function(countryName){
            return $soap.post(citiesUrl, "GetCitiesByCountry", {CountryName: countryName});
        },
        AgendasUsuario: function(usuarioId) {
            return $soap.post(usersUrl, "AgendasUsuario", {Id: usuarioId});
        }
    }
}])

.factory("$soap", ['$q', function($q) {
  return {
    post: function(url, action, params) {
      var deferred = $q.defer();
      
      //Create SOAPClientParameters
      var soapParams = new SOAPClientParameters();
      for(var param in params){
        soapParams.add(param, params[param]);
      }
      
      //Create Callback
      var soapCallback = function(e) {
        if(e.constructor.toString().indexOf("function Error()") != -1) {
          deferred.reject("An error has occurred.");
        } else {
          deferred.resolve(e);
        }
      }
      SOAPClient.invoke(url, action, soapParams, true, soapCallback);

      return deferred.promise;
    }
  }
}])

/*
.factory('Api', function($http, ApiEndpoint) {
  console.log('ApiEndpoint', ApiEndpoint)

  var getApiData = function() {
    return $http.get(ApiEndpoint.url + '/srvAgendas.svc')
      .then(function(data) {
        console.log('Got some data: ', data);
        return data;
      });
  };

  return {
    getApiData: getApiData
  };
})
*/