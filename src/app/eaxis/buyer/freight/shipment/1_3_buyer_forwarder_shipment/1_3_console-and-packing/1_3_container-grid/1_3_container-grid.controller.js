(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeContainerGridController", oneThreeContainerGridController);

        oneThreeContainerGridController.$inject = ["$scope", "$filter", "$uibModal", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService","three_shipmentConfig"];

    function oneThreeContainerGridController($scope, $filter, $uibModal, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService,three_shipmentConfig) {
        /* jshint validthis: true */
        var oneThreeContainerGridCtrl = this;

        function Init() {
            var currentObject = oneThreeContainerGridCtrl.currentObject[oneThreeContainerGridCtrl.currentObject.label].ePage.Entities;
            oneThreeContainerGridCtrl.ePage = {
                "Title": "",
                "Prefix": "Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObject,
                "GlobalVariables": {
                    "Loading": false,
                    "NonEditable": false
                }
            };
            oneThreeContainerGridCtrl.ePage.Masters.TableProperties=three_shipmentConfig.Entities.TableProperties;
            GetConsolListing();
        }
        
        function GetConsolListing() {
            var _filter = {
                "SHP_FK": oneThreeContainerGridCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeContainerGridCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    GetContainerList(response.data.Response);
                }
            });
        }
        function GetContainerList(data) {
            oneThreeContainerGridCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            if (data.length > 0) {
                data.map(function (value1, key1) {
                    value1.UICntContainerList.map(function (value2, key2) {
                        var _isExist = oneThreeContainerGridCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
                            return value3.PK === value2.PK;
                        });

                        if (!_isExist) {
                            var _obj = {
                                "ContainerNo": value2.ContainerNo,
                                "CNT": value2.PK,
                                "ContainerCount": value2.ContainerCount,
                                "RC_Type": value2.RC_Type,
                                "SealNo": value2.SealNo
                            };
                            oneThreeContainerGridCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                        }
                    });
                });
            } else {
                oneThreeContainerGridCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            }
        }

        Init();
    }
})();