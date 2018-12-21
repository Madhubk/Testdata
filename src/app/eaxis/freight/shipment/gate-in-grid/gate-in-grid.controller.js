(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GateInGridController", GateInGridController);

    GateInGridController.$inject = ["$rootScope", "$scope", "$filter", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "toastr", "confirmation", "$uibModal"];

    function GateInGridController($rootScope, $scope, $filter, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, appConfig, toastr, confirmation, $uibModal) {
        /* jshint validthis: true */
        var GateInGridCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            var currentObject;
            (GateInGridCtrl.currentObject) ? currentObject = GateInGridCtrl.currentObject[GateInGridCtrl.currentObject.label].ePage.Entities : currentObject = GateInGridCtrl.obj[GateInGridCtrl.obj.label].ePage.Entities;
            // var currentObject = GateInGridCtrl.currentObject[GateInGridCtrl.currentObject.label].ePage.Entities;
            GateInGridCtrl.ePage = {
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
            GateInGridCtrl.ePage.Masters.Routing = {};
            GateInGridCtrl.ePage.Masters.DropDownMasterList = {};
            GateInGridCtrl.ePage.Masters.Enable = true;
            GateInGridCtrl.ePage.Masters.selectedRow = -1;
            GateInGridCtrl.ePage.Masters.selectedRowObj = {}
            GateInGridCtrl.ePage.Masters.Routing.FormView = {};
            GateInGridCtrl.ePage.Masters.emptyText = '-';
            GateInGridCtrl.ePage.Masters.TableProperties = {};
            GateInGridCtrl.ePage.Masters.ReadOnly = GateInGridCtrl.readOnly;
            GateInGridCtrl.ePage.Masters.type = GateInGridCtrl.type;
            GateInGridCtrl.ePage.Masters.GetContainerDetails = GetContainerDetails;
            GateInGridCtrl.ePage.Masters.NgRepeatFilter = { IsDeleted: false };
            // get table properties 
            if (GateInGridCtrl.readOnlyKey) {
                GateInGridCtrl.ePage.Masters.readOnlyKey = GateInGridCtrl.readOnlyKey;
            }
            else {
                GateInGridCtrl.ePage.Masters.readOnlyKey = "empty";
            }
            if (GateInGridCtrl.tableProperties) {
                $timeout(function () {
                    GateInGridCtrl.ePage.Masters.TableProperties.UIRouteLines = angular.copy(GateInGridCtrl.tableProperties);
                    GetContainerDetails();
                });
            } else {
                GetGridColumList();
                GetContainerDetails();
            }

            GateInGridCtrl.ePage.Masters.DatePicker = {};
            GateInGridCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            GateInGridCtrl.ePage.Masters.DatePicker.isOpen = [];
            GateInGridCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GateInGridCtrl.ePage.Masters.Pagination = {};
            GateInGridCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            GateInGridCtrl.ePage.Masters.Pagination.MaxSize = 3;
            GateInGridCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;

            GateInGridCtrl.ePage.Masters.Routing._ConLength = 0;
            GateInGridCtrl.ePage.Masters.DropDownMasterList = {
                "ROUTEMODE": {
                    "ListSource": []
                },
                "ROUTESTATUS": {
                    "ListSource": []
                },
                "ROUTETYPES": {
                    "ListSource": []
                }
            }

            if (!GateInGridCtrl.currentObject.isNew) {
                //GetRelatedConsoleDetails();
            } else {
                GateInGridCtrl.ePage.Masters.Routing.GridData = [];
            }

            GetMastersDropDownList();
            GetRelatedLookupList();
        }

        function GetContainerDetails() {
            var _input = [];
            var _consolePK = [];
            if (GateInGridCtrl.ePage.Entities.Header.Data.UIConShpMappings) {
                GateInGridCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                    _consolePK.push(value.CON_FK);

                });
                _input = {
                    "searchInput": [{
                        "FieldName": "CON_FK",
                        "value": _consolePK.toString()
                    }],
                    "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        GateInGridCtrl.ePage.Entities.Header.Data.UICntContainerList = response.data.Response;
                    } else {
                        GateInGridCtrl.ePage.Entities.Header.Data.UICntContainerList = [];
                        console.log("There is no Containers");
                    }
                });
            }
            else {
                GateInGridCtrl.ePage.Masters.Routing.GridData = [];
                GetRotingList(GateInGridCtrl.ePage.Masters.Routing.GridData);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            GateInGridCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["ROUTEMODE", "ROUTESTATUS", "ROUTETYPES"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        GateInGridCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        GateInGridCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "RoutingVessel_3186,ShpRoutingLoadPort_3103,ShpRoutingDischargePort_3102",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                        //GateInGridCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    }
                }
            });
        }

        function GetGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": "EXPORTOPERATION",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value);
                        GateInGridCtrl.ePage.Masters.TableProperties.UIExportOperations = obj;
                    }
                }
            });
        }
        Init();
    }
})();