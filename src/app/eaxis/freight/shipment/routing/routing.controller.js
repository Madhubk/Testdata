(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RoutingController", RoutingController);

    RoutingController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "toastr", "confirmation"];

    function RoutingController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, helperService, appConfig, toastr, confirmation) {
        /* jshint validthis: true */
        var RoutingCtrl = this;

        function Init() {
            var currentObject = RoutingCtrl.currentObject[RoutingCtrl.currentObject.label].ePage.Entities;
            RoutingCtrl.ePage = {
                "Title": "",
                "Prefix": "Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObject
            };
            RoutingCtrl.ePage.Masters.Routing = {};
            RoutingCtrl.ePage.Masters.DropDownMasterList = {};

            RoutingCtrl.ePage.Masters.Routing.IsFormView = false;
            RoutingCtrl.ePage.Masters.Routing.FormView = {};

            RoutingCtrl.ePage.Masters.DatePicker = {};
            RoutingCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            RoutingCtrl.ePage.Masters.DatePicker.isOpen = [];
            RoutingCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            // Grid Configuration Input
            RoutingCtrl.ePage.Masters.Routing.gridConfig = appConfig.Entities.JobRoutes.Grid.GridConfig;
            RoutingCtrl.ePage.Masters.Routing.gridConfig.columnDef = appConfig.Entities.JobRoutes.Grid.ColumnDef;

            RoutingCtrl.ePage.Masters.Routing.SelectedGridRow = SelectedGridRow;
            RoutingCtrl.ePage.Masters.Routing.AddNewRouting = AddNewRouting;
            RoutingCtrl.ePage.Masters.Routing.EditRouting = EditRouting;
            RoutingCtrl.ePage.Masters.Routing.DeleteRouting = DeleteRouting;
            RoutingCtrl.ePage.Masters.Routing.DeleteConfirmation = DeleteConfirmation;
            RoutingCtrl.ePage.Masters.Routing.AddToGrid = AddToGrid;

            RoutingCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            RoutingCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;

            $rootScope.GetRotingList = GetRelatedConsoleDetails;

            if (!RoutingCtrl.currentObject.isNew) {
                // GetRelatedConsoleDetails();
            } else {
                RoutingCtrl.ePage.Masters.Routing.GridData = [];
            }
            GetMastersDropDownList();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            RoutingCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["TRANSTYPE", "ROUTEMODE", "ROUTESTATUS", "ROUTETYPES"];
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
                        RoutingCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        RoutingCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetRelatedConsoleDetails() {
            var dynamicFindAllInput = [];
            if (RoutingCtrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                RoutingCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                    dynamicFindAllInput[key] = {
                        "FieldName": RoutingCtrl.apiHeaderFieldName,
                        "value": value[RoutingCtrl.apiHeaderValueName]
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
                        RoutingCtrl.ePage.Masters.Routing.GridData = [];
                        console.log("Routing Mapping list Empty");
                    }
                });
            } else {
                RoutingCtrl.ePage.Masters.Routing.GridData = [];
                GetRotingList(RoutingCtrl.ePage.Masters.Routing.GridData)
            }
        }

        function GetRotingList(list) {
            var _filter = {};
            var field = "";
            if (RoutingCtrl.keyObjectName == 'SHP') {
                field = RoutingCtrl.ePage.Entities.Header.Data.PK
                if (list.length > 0) {
                    list.map(function (value, key) {
                        field += ',' + value[RoutingCtrl.fkName]
                    });

                }

            } else {
                field = RoutingCtrl.ePage.Entities.Header.Data.PK
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
                    RoutingCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;
                } else {
                    console.log("Routing list Empty");
                }
                GetRoutingDetails();
            });
            // } else {
            //     RoutingCtrl.ePage.Masters.Routing.GridData = [];
            // }
        }

        function GetRoutingDetails() {
            var _gridData = [];
            RoutingCtrl.ePage.Masters.Routing.GridData = undefined;
            $timeout(function () {
                if (RoutingCtrl.ePage.Entities.Header.Data.UIJobRoutes.length > 0) {
                    RoutingCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("Routing List is Empty");
                }

                RoutingCtrl.ePage.Masters.Routing.GridData = _gridData;
                RoutingCtrl.ePage.Masters.Routing.FormView = {};
            });
        }

        function AddNewRouting() {
            RoutingCtrl.ePage.Masters.Routing.FormView = {};

            RoutingCtrl.ePage.Masters.Routing.FormView.Creditor = {
                AddressList: []
            };
            RoutingCtrl.ePage.Masters.Routing.FormView.Carrier = {
                AddressList: []
            };
            RoutingCtrl.ePage.Masters.Routing.FormView.DeptFrom = {
                AddressList: []
            };
            RoutingCtrl.ePage.Masters.Routing.FormView.ArrivalAt = {
                AddressList: []
            };
            RoutingCtrl.ePage.Masters.Routing.FormView.TransportMode = 'SEA'
            LoadAddressContactListAutomatic();

            RoutingCtrl.ePage.Masters.Routing.IsFormView = true;
        }

        function EditRouting($item, index) {
            if ($item.EntitySource == RoutingCtrl.keyObjectName) {
                RoutingCtrl.ePage.Masters.Routing.IsFormView = true;
                RoutingCtrl.ePage.Masters.Routing.FormView = $item;
                RoutingCtrl.ePage.Masters.Routing.FormView.Index = index;

                RoutingCtrl.ePage.Masters.Routing.FormView.Creditor = {
                    AddressList: []
                };
                RoutingCtrl.ePage.Masters.Routing.FormView.Carrier = {
                    AddressList: []
                };
                RoutingCtrl.ePage.Masters.Routing.FormView.DeptFrom = {
                    AddressList: []
                };
                RoutingCtrl.ePage.Masters.Routing.FormView.ArrivalAt = {
                    AddressList: []
                };
            } else {
                toastr.warning("Record Not  Editable...!");
            }
        }

        function DeleteConfirmation($item, index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteRouting($item, index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteRouting($item, index) {
            if ($item.EntitySource == RoutingCtrl.keyObjectName) {
                RoutingCtrl.ePage.Masters.Routing.IsFormView = false;
                apiService.get("eAxisAPI", appConfig.Entities.JobRoutes.API.Delete.Url + $item.PK).then(function (response) {
                    if (response.data.Response) {
                        RoutingCtrl.ePage.Entities.Header.Data.UIJobRoutes.splice(index, 1);
                        GetRoutingDetails();
                        toastr.success("Record Deleted Successfully...!");
                    } else {
                        console.log("Routing list Empty");
                    }
                });
            } else {
                toastr.warning("Record Not  Editable...!");
            }
        }

        function SelectedGridRow($item) {
            if ($item.action === "edit") {
                EditRouting($item);
            } else if ($item.action === "delete") {
                DeleteConfirmation($item);
            }
        }

        function AddToGrid() {
            var _isEmpty = angular.equals({}, RoutingCtrl.ePage.Masters.Routing.FormView);
            if (!_isEmpty) {
                var _isExist = RoutingCtrl.ePage.Entities.Header.Data.UIJobRoutes.some(function (value, key) {
                    return angular.equals(value, RoutingCtrl.ePage.Masters.Routing.FormView);
                });
                if (!_isExist) {
                    // API Call
                    RoutingCtrl.ePage.Masters.Routing.FormView.EntitySource = RoutingCtrl.keyObjectName
                    RoutingCtrl.ePage.Masters.Routing.FormView.EntityRefKey = RoutingCtrl.ePage.Entities.Header.Data.PK
                    apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.Insert.Url, [RoutingCtrl.ePage.Masters.Routing.FormView]).then(function (response) {
                        if (response.data.Response) {
                            RoutingCtrl.ePage.Entities.Header.Data.UIJobRoutes.push(response.data.Response[0]);
                            GetRoutingDetails();
                            toastr.success("Record Added Successfully...!");
                        } else {
                            console.log("Routing list Empty");
                        }
                    });

                } else {
                    RoutingCtrl.ePage.Masters.Routing.FormView.IsModified = true
                    apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.Update.Url, RoutingCtrl.ePage.Masters.Routing.FormView).then(function (response) {
                        if (response.data.Response) {
                            RoutingCtrl.ePage.Entities.Header.Data.UIJobRoutes[RoutingCtrl.ePage.Masters.Routing.FormView.Index] = response.data.Response;
                            GetRoutingDetails();
                            toastr.success("Record Added Successfully...!");
                        } else {
                            console.log("Routing list Empty");
                        }
                    });
                }
                RoutingCtrl.ePage.Masters.Routing.IsFormView = false;
            } else {
                toastr.success("Cannot Insert Empty Data...!");
            }
        }

        function LoadAddressContactListAutomatic() {
            // Creditor
            if (RoutingCtrl.ePage.Masters.Routing.FormView.CreditorOrg_FK) {
                GetAddressContactList(RoutingCtrl.ePage.Masters.Routing.FormView, "OrgAddress", "AddressList", "CreditorOrg_FK", "Creditor", RoutingCtrl.ePage.Masters.Routing.FormView);
            }
            // Carrier
            // if (RoutingCtrl.ePage.Masters.Routing.FormView.CarrierOrg_FK) {
            //     GetAddressContactList(RoutingCtrl.ePage.Masters.Routing.FormView, "OrgAddress", "AddressList", "CarrierOrg_FK", "PCFS", RoutingCtrl.ePage.Masters.Routing.FormView);
            // }
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName, addressType, obj) {
            obj[addressType][listSource] = undefined;
            obj[addressType].IsModified = true;

            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    obj[addressType][listSource] = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function AutoCompleteOnSelect($item, type, addressType) {
            GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type, RoutingCtrl.ePage.Masters.Routing.FormView);
        }

        function SelectedLookupData($item, type, addressType) {
            GetAddressContactList($item.entity, "OrgAddress", "AddressList", "PK", type, RoutingCtrl.ePage.Masters.Routing.FormView);
        }

        Init();
    }
})();