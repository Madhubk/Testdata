(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LevelLoadController", LevelLoadController);

    LevelLoadController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$http", "$filter"];

    function LevelLoadController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $http, $filter) {

        var LevelLoadCtrl = this;

        function Init() {

            LevelLoadCtrl.ePage = {
                "Title": "",
                "Prefix": "Level_Load",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };

            LevelLoadCtrl.ePage.Masters.IsNoRecords = false;
            // 

            LevelLoad()
            LevelLoadCtrl.ePage.Masters.storeClick  = storeClick; 
            LevelLoadCtrl.ePage.Masters.Search = Search;
            LevelLoadCtrl.ePage.Masters.show = [];
            LevelLoadCtrl.ePage.Masters.selectedrow = -1;
            LevelLoadCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            
        }


        function LevelLoad(){
            var _filter = {
                
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSLLL"
            };
            apiService.post("eAxisAPI", "TmsLevelLoadLimit/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    LevelLoadCtrl.ePage.Masters.LevelLoadLimit = response.data.Response;
                    angular.forEach(LevelLoadCtrl.ePage.Masters.LevelLoadLimit,function(value,key){
                        value.isSelected = false;
                    });
                    LevelLoadCtrl.ePage.Masters.LevelLoad = _.groupBy(LevelLoadCtrl.ePage.Masters.LevelLoadLimit, 'StoreCode');
                    
                    angular.forEach(LevelLoadCtrl.ePage.Masters.LevelLoad,function(value,key){
                        value.isSelected = false;
                    });
                    angular.forEach(LevelLoadCtrl.ePage.Masters.LevelLoad,function(value,key){
                        
                    });
                }
            });
        }

        function storeClick(index,store){
            if(index == LevelLoadCtrl.ePage.Masters.selectedrow){
                LevelLoadCtrl.ePage.Masters.selectedrow = -1;
                angular.forEach(LevelLoadCtrl.ePage.Masters.LevelLoad,function(value,key){
                    value.isSelected = false;
                });
                
            }else{
                LevelLoadCtrl.ePage.Masters.selectedrow = index;
                angular.forEach(LevelLoadCtrl.ePage.Masters.LevelLoad,function(value,key){
                    if(key == store){
                        value.isSelected = true;
                    }else{
                        value.isSelected = false;
                    }
                }); 
            }
        }

        function Search(findtext){
            LevelLoadCtrl.ePage.Masters.LevelLoad = _.groupBy($filter('filter')(LevelLoadCtrl.ePage.Masters.LevelLoadLimit,findtext),'StoreCode');
        }

        function OpenEditForm($item, isNewMode) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "level-load-edit" ,
                scope: $scope,
                templateUrl: "app/eaxis/transports/level-load/level-load-edit/level-load-edit.html",
                controller: 'LevelLoadEditController as LevelLoadEditCtrl',
                bindToController: true, 
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": LevelLoadCtrl.ePage.Masters.LevelLoadLimit,
                            "Item": $item,
                            "isNewMode": isNewMode
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    // var _obj = {
                    //     "Refresh": LevelLoad
                    // };
                    // _obj[response.type]();
                    LevelLoad();
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        Init();
    }

})();