(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerGridController", ContainerGridController);

    ContainerGridController.$inject = ["$scope", "$filter", "$uibModal", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService","shipmentConfig"];

    function ContainerGridController($scope, $filter, $uibModal, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService,shipmentConfig) {
        /* jshint validthis: true */
        var ContainerGridCtrl = this;

        function Init() {
            var currentObject = ContainerGridCtrl.currentObject[ContainerGridCtrl.currentObject.label].ePage.Entities;
            ContainerGridCtrl.ePage = {
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
            ContainerGridCtrl.ePage.Masters.TableProperties=shipmentConfig.Entities.TableProperties;
            GetConsolListing();
        }
        
        function GetConsolListing() {
            var _filter = {
                "SHP_FK": ContainerGridCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ContainerGridCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    GetContainerList(response.data.Response);
                }
            });
        }
        function GetContainerList(data) {
//             ContainerGridCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            if (data.length > 0) {
                data.map(function (value1, key1) {
                    value1.UICntContainerList.map(function (value2, key2) {
                        var _isExist = ContainerGridCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
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
                            ContainerGridCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                        }
                    });
                });
            } else {
                ContainerGridCtrl.ePage.Entities.Header.Data.UICntContainers = [];
            }
        }

        Init();
    }
})();