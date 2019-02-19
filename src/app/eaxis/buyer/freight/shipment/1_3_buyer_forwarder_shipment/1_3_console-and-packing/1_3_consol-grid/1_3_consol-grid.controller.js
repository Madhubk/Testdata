(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeConsolGridController", oneThreeConsolGridController);

        oneThreeConsolGridController.$inject = ["$scope", "$filter", "$uibModal", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService","three_shipmentConfig"];

    function oneThreeConsolGridController($scope, $filter, $uibModal, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService,three_shipmentConfig) {
        /* jshint validthis: true */
        var oneThreeConsolGridCtrl = this;

        function Init() {
            var currentObject = oneThreeConsolGridCtrl.currentObject[oneThreeConsolGridCtrl.currentObject.label].ePage.Entities;
            oneThreeConsolGridCtrl.ePage = {
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
            oneThreeConsolGridCtrl.ePage.Masters.SelectedGridRowConsol=SelectedGridRowConsol;
            oneThreeConsolGridCtrl.ePage.Masters.TableProperties=three_shipmentConfig.Entities.TableProperties;
            oneThreeConsolGridCtrl.ePage.Masters.SelectedConsoleData=SelectedConsoleData;
            oneThreeConsolGridCtrl.ePage.Masters.selectedRow=-1;
            oneThreeConsolGridCtrl.ePage.Masters.selectedRowObj=null;
            if (!oneThreeConsolGridCtrl.currentObject.isNew) {
                GetConsolListing();
            } else {
                oneThreeConsolGridCtrl.ePage.Entities.Header.Data.UIConShpMappings = [];
            }
        }
        function SelectedConsoleData($item) {
            var _tempArray = [];

            $item.map(function (val, key) {
                var _isExist = oneThreeConsolGridCtrl.ePage.Entities.Header.Data.UIConShpMappings.some(function (value, index) {
                    return value.CON_FK === val.PK;
                });

                if (!_isExist) {
                    var _tempObj = {
                        "SHP_FK": oneThreeConsolGridCtrl.ePage.Entities.Header.Data.PK,
                        "CON_FK": val.PK,
                        "PK": "",
                        "TenantCode": authService.getUserInfo().TenantCode,
                    };
                    _tempArray.push(_tempObj)
                } else {
                    toastr.warning(val.ConsolNo + " Already Available...!");
                }
            });
            if (_tempArray.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.Insert.Url, _tempArray).then(function (response) {
                    if (response.data.Response) {}
                    GetConsolListing();
                });
            }
        }
        function GetConsolListing() {
            var _filter = {
                "SHP_FK": oneThreeConsolGridCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeConsolGridCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                }
            });
        }
        function SelectedGridRowConsol(item) {
            ConsoleDeleteConfirmation(item);
        }

        function ConsoleDeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteConsole($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteConsole($item) {
            var _index = oneThreeConsolGridCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                return value.PK;
            }).indexOf($item.PK);

            if (_index !== -1) {
                apiService.get("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.Delete.Url + $item.PK).then(function (response) {
                    if (response.data.Response) {
                        GetConsolListing();
                        // $rootScope.GetContainerList();
                        // $rootScope.GetRotingList();
                    }
                });
            }
        }
        Init();
    }
})();