/*
    Page : Liner Invoice
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ImpSeaContainerContainerEmptyReturnRequestGlbController", ImpSeaContainerContainerEmptyReturnRequestGlbController);

    ImpSeaContainerContainerEmptyReturnRequestGlbController.$inject = ["$injector","$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "authService"];

    function ImpSeaContainerContainerEmptyReturnRequestGlbController($injector,$scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, authService) {
        var ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl = this, dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Details_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };


            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.emptyText = "-";
            if (ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.taskObj) {
                ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.TaskObj = ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.taskObj;
                initContainer();
            } else {
                ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            }
        }
        function initContainer() {
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = {}
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.DropDownMasterList = {};
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.DatePicker = {};
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.DatePicker.isOpen = [];
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.JobDocumentCount = null;
            // Callback
            var _isEmpty = angular.equals({}, ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                //   GetMastersList();
            }
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_SendingForwarderAddressFK": helperService.metaBase(),
                "OAD_ReceivingForwarderAddressFK": helperService.metaBase(),
                "OAD_CarrierAddressFK": helperService.metaBase(),
                "OAD_CreditorAddressFK": helperService.metaBase()
            };
            //console.log(ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.DatePicker.Options)
            GetContainer();
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function GetContainer() {
            if (ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.CntContainer.API.GetById.Url + ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentContainer = response.data.Response;
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Entities.Header.Data.UICntContainers = ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentContainer;
                        console.log(ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentContainer)
                        GetEntityObj();
                    }
                });
            }
        }
        function GetEntityObj() {
            if (ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentContainer.CON_FK) {
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": {},
                            "Meta": {}
                        }
                    }
                }
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentContainer.CON_FK).then(function (response) {
                    if (response.data.Response) {
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [response.data.Response.UIConConsolHeader.ConsolNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIConConsolHeader.ConsolNo,
                            code: response.data.Response.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Entities.Header.Data = response.data.Response;
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol = obj;
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsolHeader = ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol[ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol.label].ePage.Entities.Header.Data.UIConConsolHeader;
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Entities = ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol[ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol.label].ePage.Entities;
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.CntList = ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol[ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol.label].ePage.Entities.Header.Data.UICntContainers;
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.ConsolDetails = response.data.Response.UIConShpMappings;
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.CntList = ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol;
                        ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.ePage.Masters.EntityObj = response.data.Response;
                        GetShipmentListing();
                    }
                });
            }
        }
        function GetShipmentListing() {
            var _filter = {
                "CON_FK": ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol[ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol.label].ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol[ImpSeaContainerContainerEmptyReturnRequestGlbDirCtrl.currentConsol.label].ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    $rootScope.GetRotingList();
                    var shpFkList = response.data.Response;
                }
            });
        }

        Init();
    }
})();