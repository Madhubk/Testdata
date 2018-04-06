(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GeneralConController", GeneralConController);

    GeneralConController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "consolidationConfig", "appConfig", "helperService", "$filter", "toastr", "dynamicLookupConfig", "confirmation"];

    function GeneralConController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, consolidationConfig, appConfig, helperService, $filter, toastr, dynamicLookupConfig, confirmation) {
        /* jshint validthis: true */
        var GeneralConCtrl = this;

        function Init() {
            var currentConsol = GeneralConCtrl.currentConsol[GeneralConCtrl.currentConsol.label].ePage.Entities;
            GeneralConCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_General",
                "Masters": {
                    "ConsolShipment": {},
                    "Reference": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentConsol,
            };

            // DatePicker
            GeneralConCtrl.ePage.Masters.DatePicker = {};
            GeneralConCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            GeneralConCtrl.ePage.Masters.DatePicker.isOpen = [];
            GeneralConCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GeneralConCtrl.ePage.Masters.DropDownMasterList = consolidationConfig.Entities.Header.Meta;

            GeneralConCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_SendingForwarderAddressFK": helperService.metaBase(),
                "OAD_ReceivingForwarderAddressFK": helperService.metaBase(),
                "OAD_CarrierAddressFK": helperService.metaBase(),
                "OAD_CreditorAddressFK": helperService.metaBase()
            };


            GeneralConCtrl.ePage.Masters.SelectedData = SelectedData;

            var _isEmpty = angular.equals({}, GeneralConCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersDropDownList();
            }

            if (!GeneralConCtrl.currentConsol.isNew) {
                dynamicOrgAddressFetch();
                ReferenceInit();
            } else {
                GeneralConCtrl.ePage.Entities.Header.Data.UIShipmentHeaderList = [];
            }


        }


        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            GeneralConCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }



        function GetMastersDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WEIGHTUNIT", "VOLUMEUNIT", "RELEASETYPE", "AIRWAY", "HEIGHTUNIT", "CON_TYPE", "CON_SERVICELEVEL", "CON_PAYMENT", "CON_SCRN", "CON_TRANSPORT", "CON_CNTMODE", "PHASE", "CON_MANIFEST", "REFNUMTYPE"];
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
                typeCodeList.map(function (value, key) {
                    GeneralConCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                    GeneralConCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                });
                for (var x in GeneralConCtrl.ePage.Entities.Header.Meta) {
                    GeneralConCtrl.ePage.Masters.DropDownMasterList[x] = GeneralConCtrl.ePage.Entities.Header.Meta[x];
                }

            });
        }

        function SelectedData(item, ListSource) {

            if (ListSource) {
                getSetNearByField(item, "OrgAddress", ListSource);
            }

        }

        function getSetNearByField(item, api, listSource) {
            var _filter = {
                ORG_FK: item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GeneralConCtrl.ePage.Masters.DropDownMasterListAddress[listSource].ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function dynamicOrgAddressFetch() {
            var dynamicFindAllOrgAddressInput = [{
                "OAD_SendingForwarderAddressFK": GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_SendingForwarderFK
            }, {
                "OAD_ReceivingForwarderAddressFK": GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ReceivingForwarderFK
            }, {
                "OAD_CarrierAddressFK": GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CarrierFK
            }, {
                "OAD_CreditorAddressFK": GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CreditorFK
            }];
            var dynamicFindAllInputBuild = []
            dynamicFindAllOrgAddressInput.map(function (value, key) {
                if (value[Object.keys(value).join()] !== null) {
                    dynamicFindAllInputBuild.push({
                        "FieldName": Object.keys(value).join(),
                        "value": value[Object.keys(value).join()]
                    })
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInputBuild,
                "FilterID": appConfig.Entities.OrgAddress.API.DynamicFindAll.FilterID
            };
            if (dynamicFindAllInputBuild.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        dynamicFindAllInputBuild.map(function (value, key) {
                            GeneralConCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].ListSource = response.data.Response[value.FieldName];
                        });
                    }
                });
            }
        }

        // ===================== Reference Begin =====================
        function ReferenceInit() {
            // Reference Form View
            GeneralConCtrl.ePage.Masters.Reference.IsSelected = false;
            GeneralConCtrl.ePage.Masters.Reference.IsFormView = false;
            GeneralConCtrl.ePage.Masters.Reference.FormView = {};
            // Reference Grid
            GeneralConCtrl.ePage.Masters.Reference.gridConfig = GeneralConCtrl.ePage.Entities.Reference.Grid.GridConfig;
            GeneralConCtrl.ePage.Masters.Reference.gridConfig.columnDef = GeneralConCtrl.ePage.Entities.Reference.Grid.ColumnDef;

            GeneralConCtrl.ePage.Masters.Reference.AddNewReference = AddNewReference;
            GeneralConCtrl.ePage.Masters.Reference.SelectedGridRowReference = SelectedGridRowReference
            GeneralConCtrl.ePage.Masters.Reference.EditReference = EditReference;
            GeneralConCtrl.ePage.Masters.Reference.DeleteReference = DeleteReference;
            GeneralConCtrl.ePage.Masters.Reference.DeleteConfirmation = DeleteConfirmation;
            GeneralConCtrl.ePage.Masters.Reference.AddToGridReference = AddToGridReference;

            if (!GeneralConCtrl.currentConsol.isNew) {
                GetReferenceList();
            } else {
                GeneralConCtrl.ePage.Masters.Reference.GridData = [];
            }
        }

        // APICall For Service and Reference
        function GetReferenceList() {
            // Reference grid list
            var _filter = {
                SortColumn: "CEN_EntryNum",
                SortType: "asc",
                EntityRefKey: GeneralConCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEntryNum.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums = response.data.Response;
                    GetReferenceDetails();
                }
            });
        }

        //GridDetails For Reference
        function GetReferenceDetails() {
            var _gridData = [];
            GeneralConCtrl.ePage.Masters.Reference.GridData = undefined;
            $timeout(function () {
                if (GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.length > 0) {
                    GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                        if (value.Category !== "CUS") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Reference List is Empty");
                }

                GeneralConCtrl.ePage.Masters.Reference.GridData = _gridData;
                GeneralConCtrl.ePage.Masters.Reference.FormView = {};
            }, 1000);
        }



        //Add New For Reference
        function AddNewReference() {
            if (!GeneralConCtrl.currentConsol.isNew) {
                GeneralConCtrl.ePage.Masters.Reference.FormView = {};
                GeneralConCtrl.ePage.Masters.Reference.IsFormView = true;
            } else {
                toastr.warning("Please Save Consol....")
            }
        }

        function SelectedGridRowReference($item) {
            if ($item.action == 'edit')
                EditReference($item)
            else
                DeleteConfirmation($item)
        }
        //Edit For Reference
        function EditReference($item) {
            GeneralConCtrl.ePage.Masters.Reference.IsFormView = true;
            GeneralConCtrl.ePage.Masters.Reference.FormView = $item.data;
        }

        function DeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteReference($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        //Delete For Reference
        function DeleteReference($item) {
            var _index = GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.indexOf($item.data);
            if (_index != -1) {
                apiService.get("eAxisAPI", appConfig.Entities.JobEntryNum.API.Delete.Url + $item.data.PK).then(function (response) {
                    if (response.data.Response) {
                        GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.splice(_index, 1);
                        toastr.success("Record Deleted Successfully...!");
                        GetReferenceDetails();
                    }
                });
            }
        }



        // AddToGrid For Reference
        function AddToGridReference() {
            var _isEmpty = angular.equals({}, GeneralConCtrl.ePage.Masters.Reference.FormView);

            if (!_isEmpty) {
                var _index = GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                    return value.PK;
                }).indexOf(GeneralConCtrl.ePage.Masters.Reference.FormView.PK);

                if (_index === -1) {
                    GeneralConCtrl.ePage.Masters.Reference.FormView.EntityRefKey = GeneralConCtrl.ePage.Entities.Header.Data.PK;
                    GeneralConCtrl.ePage.Masters.Reference.FormView.EntitySource = "CON";
                    GeneralConCtrl.ePage.Masters.Reference.FormView.Category = "OTH";
                    GeneralConCtrl.ePage.Masters.Reference.FormView.RN_NKCountryCode = authService.getUserInfo().CountryCode;
                    GeneralConCtrl.ePage.Masters.Reference.FormView.EntryIsSystemGenerated = false;
                    GeneralConCtrl.ePage.Masters.Reference.FormView.IsValid = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Insert.Url, [GeneralConCtrl.ePage.Masters.Reference.FormView]).then(function (response) {
                        if (response.data.Response) {
                            GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(response.data.Response[0]);
                            GetReferenceDetails();
                        }
                    });

                } else {
                    GeneralConCtrl.ePage.Masters.Reference.FormView.IsModified = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Update.Url, GeneralConCtrl.ePage.Masters.Reference.FormView).then(function (response) {
                        if (response.data.Response) {
                            GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums[_index] = response.data.Response;
                            GetReferenceDetails();
                        }
                    });
                }
                GeneralConCtrl.ePage.Masters.Reference.IsFormView = false;
            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }
        // ===================== Reference End =====================


        Init();
    }
})();