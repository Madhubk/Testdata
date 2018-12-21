(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RoutingGridController", RoutingGridController);

    RoutingGridController.$inject = ["$rootScope", "$scope", "$filter", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "toastr", "confirmation", "$uibModal"];

    function RoutingGridController($rootScope, $scope, $filter, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, appConfig, toastr, confirmation, $uibModal) {
        /* jshint validthis: true */
        var RoutingGridCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            var currentObject;
            (RoutingGridCtrl.currentObject) ? currentObject = RoutingGridCtrl.currentObject[RoutingGridCtrl.currentObject.label].ePage.Entities : currentObject = RoutingGridCtrl.obj[RoutingGridCtrl.obj.label].ePage.Entities;
            // var currentObject = RoutingGridCtrl.currentObject[RoutingGridCtrl.currentObject.label].ePage.Entities;
            RoutingGridCtrl.ePage = {
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
            RoutingGridCtrl.ePage.Masters.Routing = {};
            RoutingGridCtrl.ePage.Masters.DropDownMasterList = {};
            RoutingGridCtrl.ePage.Masters.Enable = true;
            RoutingGridCtrl.ePage.Masters.selectedRow = -1;
            RoutingGridCtrl.ePage.Masters.selectedRowObj = {}
            RoutingGridCtrl.ePage.Masters.Routing.FormView = {};
            RoutingGridCtrl.ePage.Masters.emptyText = '-';
            RoutingGridCtrl.ePage.Masters.Routing.More = More;
            RoutingGridCtrl.ePage.Masters.TableProperties = {};
            RoutingGridCtrl.ePage.Masters.DateChange = DateChange;
            RoutingGridCtrl.ePage.Masters.ReadOnly = RoutingGridCtrl.readOnly;
            RoutingGridCtrl.ePage.Masters.type = RoutingGridCtrl.type;
            RoutingGridCtrl.ePage.Masters.NgRepeatFilter = { IsDeleted: false };
            // get table properties 
            if (RoutingGridCtrl.tableProperties) {
                $timeout(function () {
                    RoutingGridCtrl.ePage.Masters.TableProperties.UIRouteLines = angular.copy(RoutingGridCtrl.tableProperties);
                });
            } else {
                GetGridColumList();
            }

            RoutingGridCtrl.ePage.Masters.DatePicker = {};
            RoutingGridCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            RoutingGridCtrl.ePage.Masters.DatePicker.isOpen = [];
            RoutingGridCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            RoutingGridCtrl.ePage.Masters.veselSelected = veselSelected;
            RoutingGridCtrl.ePage.Masters.MstvesselSelected = MstvesselSelected;

            RoutingGridCtrl.ePage.Masters.Pagination = {};
            RoutingGridCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            RoutingGridCtrl.ePage.Masters.Pagination.MaxSize = 3;
            RoutingGridCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;


            RoutingGridCtrl.ePage.Masters.Routing.AddNewRouting = AddNewRouting;
            RoutingGridCtrl.ePage.Masters.Routing.DeleteRouting = DeleteRouting;
            RoutingGridCtrl.ePage.Masters.Routing.RefreshRouting = RefreshRouting;
            RoutingGridCtrl.ePage.Masters.Routing.TransportType = TransportType;
            RoutingGridCtrl.ePage.Masters.Routing._ConLength = 0;
            $rootScope.GetRotingList = GetRelatedConsoleDetails;

            RoutingGridCtrl.ePage.Masters.DropDownMasterList = {
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

            if (!RoutingGridCtrl.currentObject.isNew) {
                //GetRelatedConsoleDetails();
            } else {
                RoutingGridCtrl.ePage.Masters.Routing.GridData = [];
            }

            GetMastersDropDownList();
            GetRelatedLookupList();
        }

        function CheckFutureDate(fieldvalue, type) {
            var selectedDate = new Date(fieldvalue);
            var now = new Date();
            selectedDate.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);
            if (selectedDate > now) {
                toastr.error('Future Date Not Allowed for ' + type);
                RoutingGridCtrl.ePage.Masters.selectedRowObj[type] = null;
                return false;
            }
            else
                return true;
        }

        function DateChange(type) {
            console.log(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes);
            switch (type) {
                case 'ATD':
                    var check = CheckFutureDate(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD, 'ATD');
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD != null) {

                        if (check == true && (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD) > new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD))) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD = null;
                            toastr.error('ATD Cannot be before ETD');
                        }
                    }
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD != null) {
                        if (check == true && (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD) > new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA))) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD = null;
                            toastr.error('ATD Cannot be after ETA');
                        }
                    }
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD != null) {
                        if (check == true && (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD) > new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA))) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD = null;
                            toastr.error('ATD Cannot be after ATA');
                        }
                    }
                    break;

                case 'ATA':
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA != null) {
                        var check = CheckFutureDate(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA, 'ATA');
                        if (check == true && (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD) > new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA))) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA = null;
                            toastr.error('ATA Cannot be before ETD');
                        }
                    }
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA != null) {
                        var check = CheckFutureDate(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA, 'ATA');
                        if (check == true && (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD) > new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA))) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA = null;
                            toastr.error('ATA Cannot be before ATD');
                        }
                    }
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA != null) {
                        var check = CheckFutureDate(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA, 'ATA');
                        if (check == true && (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA) > new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA))) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA = null;
                            toastr.error('ATA Cannot be before ETA');
                        }
                    }
                    break;
                case 'ETA':
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA != null) {
                        if (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD) > new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA)) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA = null;
                            toastr.error('ETA Cannot be before ETD');
                        }
                    }
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA != null) {
                        if (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD) > new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA)) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA = null;
                            toastr.error('ETA Cannot be before ATD');
                        }
                    }
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA != null) {
                        if (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA) > new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA)) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA = null;
                            toastr.error('ETA Cannot be After ATA');
                        }
                    }
                    break;
                case 'ETD':
                    if (RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD != null && RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA != null) {
                        if (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD) > (new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ETA) || new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATD) || new Date(RoutingGridCtrl.ePage.Masters.selectedRowObj.ATA))) {
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD = null;
                            toastr.error('ETD Cannot be After ETA , ATD, ATA');
                        }
                    }
                    if (RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length > 1) {
                        var _count = 0; var _count1 = 0; var _count2 = 0;
                        if (RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 2)].ETA != null) {
                            if (RoutingGridCtrl.type == 'ConDisable') {
                                RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes1.map(function (val, key) {
                                    if (new Date(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 2)].ETA) > new Date(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 1)].ETD)) {
                                        _count = _count + 1;
                                    }
                                    if (RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes1[key].EntitySource == 'CON' && new Date(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes1[key].ETA) > new Date(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 1)].ETD)) {
                                        _count1 = _count1 + 1;

                                    }
                                });
                            }
                            else {
                                RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (val, key) {
                                    if (new Date(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 2)].ETA) > new Date(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 1)].ETD)) {
                                        _count2 = _count2 + 1;
                                    }
                                });

                            }
                            if (_count2 > 0) {
                                RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD = null;
                                toastr.error((RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length) + ' leg ETD cannot be before ' + (RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 1) + ' leg ETA');
                            }
                            if (_count > 0) {
                                RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD = null;
                                toastr.error((RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length) + ' leg ETD cannot be before ' + (RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 1) + ' leg ETA');
                            }
                            if (_count1 > 0) {
                                RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD = null;
                                toastr.error((RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length) + ' leg ETD cannot be before ' + (RoutingGridCtrl.ePage.Masters.Routing._ConLength + 1) + ' Consol leg ETA');
                            }
                        }
                        else {
                            toastr.error((RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 1) + ' leg ETA should be filled');
                            RoutingGridCtrl.ePage.Masters.selectedRowObj.ETD = "";
                        }

                    }
                    break;
            }
        }

        function veselSelected(CurrentRouting) {
            var tempobj = {
                "IsLinked": true
            };

            RoutingGridCtrl.ePage.Masters.selectedRowObj = angular.merge(RoutingGridCtrl.ePage.Masters.selectedRowObj, tempobj);
        }

        function MstvesselSelected(CurrentRouting) {
            if (CurrentRouting.Vessel) {
                CurrentRouting.IsLinked = true;
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            RoutingGridCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        RoutingGridCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        RoutingGridCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                        //RoutingGridCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    }
                }
            });
        }

        function GetGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": "ROUTING",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value);
                        RoutingGridCtrl.ePage.Masters.TableProperties.UIRouteLines = obj;
                    }
                }
            });
        }

        function GetRelatedConsoleDetails() {
            var dynamicFindAllInput = [];
            if (RoutingGridCtrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                RoutingGridCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                    dynamicFindAllInput[key] = {
                        "FieldName": RoutingGridCtrl.apiHeaderFieldName,
                        "value": value[RoutingGridCtrl.apiHeaderValueName]
                    }
                });
                var _input = {
                    "searchInput": dynamicFindAllInput,
                    "FilterID": appConfig.Entities.ConConsolHeader.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.ConConsolHeader.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        GetRotingList(response.data.Response);
                    } else {
                        RoutingGridCtrl.ePage.Masters.Routing.GridData = [];
                        console.log("Routing Mapping list Empty");
                    }
                });
            } else {
                RoutingGridCtrl.ePage.Masters.Routing.GridData = [];
                GetRotingList(RoutingGridCtrl.ePage.Masters.Routing.GridData);
            }
        }

        function GetRotingList(list) {
            var _filter = {};
            var field = "";
            if (RoutingGridCtrl.keyObjectName == 'SHP') {
                field = RoutingGridCtrl.ePage.Entities.Header.Data.PK
                if (list.length > 0) {
                    list.map(function (value, key) {
                        field += ',' + value[RoutingGridCtrl.fkName]
                    });

                }

            } else {
                field = RoutingGridCtrl.ePage.Entities.Header.Data.PK
            }
            _filter = {
                "FieldName": "EntityRefKey",
                "value": field
            }

            var _input = {
                "searchInput": [_filter],
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (RoutingGridCtrl.type == 'ConDisable') {
                        RoutingGridCtrl.ePage.Masters.CONReadOnly = true;
                        RoutingGridCtrl.ePage.Masters.NgRepeatFilter = { IsDeleted: false, EntitySource: 'SHP' }
                        RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes1 = response.data.Response;
                    }
                    else {
                        RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;
                    }
                } else {
                    console.log("Routing list Empty");
                }
            });
        }

        function More(index) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "routing-popup right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/freight/shipment/routing-grid/routing-grid-edit.html",
                controller: 'RoutingGridPopUpController',
                controllerAs: "RoutingGridPopUpCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "ParentObj": RoutingGridCtrl.ePage,
                            "index": index
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) { },
                function (response) { }
            );
        }

        function AddNewRouting() {
            RoutingGridCtrl.ePage.Masters.Routing.FormView = {};
            RoutingGridCtrl.ePage.Masters.Routing.FormView.PK = "";
            RoutingGridCtrl.ePage.Masters.Count = $filter('filter')(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes, {
                IsDeleted: false
            }).length;
            if (RoutingGridCtrl.keyObjectName == 'SHP') {
                // var _ConLength = 0;
                console.log(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes)
                RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (val, key) {
                    if (RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[key].EntitySource == 'CON') {
                        RoutingGridCtrl.ePage.Masters.Routing._ConLength = RoutingGridCtrl.ePage.Masters.Routing._ConLength + 1;
                        RoutingGridCtrl.ePage.Masters.Count = RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - RoutingGridCtrl.ePage.Masters.Routing._ConLength;
                    }
                }
                );
            }
            RoutingGridCtrl.ePage.Masters.Routing.FormView.LegOrder = RoutingGridCtrl.ePage.Masters.Count + 1;
            RoutingGridCtrl.ePage.Masters.Routing.FormView.TransportMode = RoutingGridCtrl.ePage.Entities.Header.Data[RoutingGridCtrl.apiHeaderName].TransportMode;
            RoutingGridCtrl.ePage.Masters.Routing.FormView.Status = "CNF"
            RoutingGridCtrl.ePage.Masters.Routing.FormView.IsDeleted = false;
            // if (RoutingGridCtrl.ePage.Masters.Routing.FormView.TransportMode == 'AIR') {
            //     RoutingGridCtrl.ePage.Masters.Routing.FormView.TransportType = 'FL1'
            // } else {
            //     // RoutingGridCtrl.ePage.Masters.Routing.FormView.TransportType = 'MAI'
            // }

            RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.push(RoutingGridCtrl.ePage.Masters.Routing.FormView);
            RoutingGridCtrl.ePage.Masters.selectedRow = _.orderBy(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes, {
                'LegOrder': RoutingGridCtrl.ePage.Masters.Routing.FormView.LegOrder
            }).length - 1;
            RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 1;
            RoutingGridCtrl.ePage.Masters.selectedRowObj = RoutingGridCtrl.ePage.Masters.Routing.FormView;
            console.log(RoutingGridCtrl.ePage.Masters.ReadOnly)
            console.log(RoutingGridCtrl.ePage.Masters.CONReadOnly)
            RoutingGridCtrl.ePage.Masters.NgRepeatFilter = { IsDeleted: false, PK: "" };
            // RoutingGridCtrl.ePage.Masters.CONReadOnly = false;
        }

        function DeleteRouting(index) {
            if (RoutingGridCtrl.ePage.Masters.selectedRowObj) {
                if (RoutingGridCtrl.ePage.Masters.selectedRowObj.PK) {
                    RoutingGridCtrl.ePage.Masters.RemoveList = $filter('filter')(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes, {
                        LegOrder: RoutingGridCtrl.ePage.Masters.selectedRowObj.LegOrder
                    });
                    RoutingGridCtrl.ePage.Masters.RemoveList.map(function (value, key) {
                        value.IsDeleted = true
                    });
                    RoutingGridCtrl.ePage.Masters.CountList = $filter('filter')(RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes, {
                        IsDeleted: false
                    });
                    RoutingGridCtrl.ePage.Masters.CountList.map(function (val, key) {
                        val.LegOrder = key + 1
                    });
                } else {
                    RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (val, key) {
                        if (val.PK == RoutingGridCtrl.ePage.Masters.selectedRowObj.PK && val.LegOrder == RoutingGridCtrl.ePage.Masters.selectedRowObj.LegOrder) {
                            RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.splice(key, 1);
                        }
                    });
                }
                RoutingGridCtrl.ePage.Masters.selectedRow == -1;
            }
        }

        function RefreshRouting() {
            GetRelatedConsoleDetails();
        }
        function TransportType() {
            var _count = 0;
            if (RoutingGridCtrl.keyObjectName == 'SHP' && RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 1].TransportType == 'MAI') {
                toastr.warning("Cannot Give Main Vessel in Shipment");
                RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.length - 1].TransportType = "";
            }
            else {
                RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (val, key) {
                    if (RoutingGridCtrl.ePage.Entities.Header.Data.UIJobRoutes[key].TransportType == 'MAI') {
                        _count = _count + 1;
                    }
                });
            }

            if (_count > 1) {
                toastr.warning('Cannot give Main Vessel in transport type again ');
                RoutingGridCtrl.ePage.Masters.selectedRowObj.TransportType = " ";
            }
        }
        Init();
    }

    angular
        .module("Application")
        .filter('shpcntmode', function () {
            return function (input, type) {
                var _list = [];
                if (input && type) {
                    var x = input.map(function (value, key) {
                        if (value.OtherConfig != "" && value.OtherConfig != undefined) {
                            var _input = JSON.parse(value.OtherConfig).mode
                            if (_input) {
                                var _index = _input.indexOf(type);
                                if (_index != -1) {
                                    _list.push(value)
                                }
                            }
                        }
                    });
                    return _list;
                }
            };
        });
   
})();