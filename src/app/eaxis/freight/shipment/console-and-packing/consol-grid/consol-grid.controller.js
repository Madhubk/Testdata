(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolGridController", ConsolGridController);

    ConsolGridController.$inject = ["$scope", "$filter", "$uibModal", "$timeout", "APP_CONSTANT", "helperService", "confirmation", "appConfig", "apiService", "authService","shipmentConfig"];

    function ConsolGridController($scope, $filter, $uibModal, $timeout, APP_CONSTANT, helperService, confirmation, appConfig, apiService, authService,shipmentConfig) {
        /* jshint validthis: true */
        var ConsolGridCtrl = this;

        function Init() {
            var currentObject = ConsolGridCtrl.currentObject[ConsolGridCtrl.currentObject.label].ePage.Entities;
            ConsolGridCtrl.ePage = {
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
            ConsolGridCtrl.ePage.Masters.SelectedGridRowConsol=SelectedGridRowConsol;
            ConsolGridCtrl.ePage.Masters.TableProperties=shipmentConfig.Entities.TableProperties;
            ConsolGridCtrl.ePage.Masters.SelectedConsoleData=SelectedConsoleData;
            ConsolGridCtrl.ePage.Masters.selectedRow=-1;
            ConsolGridCtrl.ePage.Masters.selectedRowObj=null;
            if (!ConsolGridCtrl.currentObject.isNew) {
                GetConsolListing();
            } else {
                ConsolGridCtrl.ePage.Entities.Header.Data.UIConShpMappings = [];
            }
        }
        function SelectedConsoleData($item) {
            var _tempArray = [];

            $item.map(function (val, key) {
                var _isExist = ConsolGridCtrl.ePage.Entities.Header.Data.UIConShpMappings.some(function (value, index) {
                    return value.CON_FK === val.PK;
                });

                if (!_isExist) {
                    var _tempObj = {
                        "SHP_FK": ConsolGridCtrl.ePage.Entities.Header.Data.PK,
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
                apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.Insert.Url, _tempArray).then(function (response) {
                    if (response.data.Response) {}
                    GetConsolListing();
                });
            }
        }
        function GetConsolListing() {
            var _filter = {
                "SHP_FK": ConsolGridCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsolGridCtrl.ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
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
            var _index = ConsolGridCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                return value.PK;
            }).indexOf($item.PK);

            if (_index !== -1) {
                apiService.get("eAxisAPI", appConfig.Entities.ConShpMapping.API.Delete.Url + $item.PK).then(function (response) {
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