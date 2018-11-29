(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SenderCarrierController", SenderCarrierController);

    SenderCarrierController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "appConfig", "toastr", "$document", "confirmation", "$filter", "$injector", "dynamicLookupConfig"];

    function SenderCarrierController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, mappingConfig, appConfig, toastr, $document, confirmation, $filter, $injector, dynamicLookupConfig) {
        /* jshint validthis: true */
        var SenderCarrierCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SenderCarrierCtrl.ePage = {
                "Title": "",
                "Prefix": "Sender_Carrier",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };

            SenderCarrierCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            SenderCarrierCtrl.ePage.Masters.DropDownMasterList = {};
            SenderCarrierCtrl.ePage.Masters.emptyText = '-'
            SenderCarrierCtrl.ePage.Masters.selectedRow = -1;
            SenderCarrierCtrl.ePage.Masters.Lineslist = true;
            SenderCarrierCtrl.ePage.Masters.HeaderName = '';

            SenderCarrierCtrl.ePage.Masters.Edit = Edit;
            SenderCarrierCtrl.ePage.Masters.CopyRow = CopyRow;
            SenderCarrierCtrl.ePage.Masters.AddNewRow = AddNewRow;
            SenderCarrierCtrl.ePage.Masters.RemoveRow = RemoveRow;
            SenderCarrierCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            SenderCarrierCtrl.ePage.Masters.Back = Back;
            SenderCarrierCtrl.ePage.Masters.Done = Done;

            SenderCarrierCtrl.ePage.Masters.OnChangeManifestType = OnChangeManifestType;

            SenderCarrierCtrl.ePage.Masters.Config = mappingConfig;

            SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails = [];

            SenderCarrierCtrl.ePage.Meta.IsLoading = false;

            GetDropDownList();
            getCfxMappingDetails();
            GetDynamicLookupConfig();
        }

        function OnChangeManifestType(ManifestType) {
            angular.forEach(SenderCarrierCtrl.ePage.Masters.DropDownMasterList.ManifestType.ListSource, function (value, key) {
                if (value.Key == ManifestType) {
                    SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[SenderCarrierCtrl.ePage.Masters.selectedRow].AddRef1_FK = value.PK;
                    SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[SenderCarrierCtrl.ePage.Masters.selectedRow].AddRef1Code = value.Key;
                }
            });
        }

        // Get DataEntryNameList 
        function GetDynamicLookupConfig() {
            var DataEntryNameList = "OrganizationList,ProductRelatedParty";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    SenderCarrierCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function getCfxMappingDetails() {
            SenderCarrierCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SenderCarrierCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", SenderCarrierCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    SenderCarrierCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues = response.data.Response;
                    SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails = [];
                    angular.forEach(SenderCarrierCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                        if (value.MappingCode == "SENDER_CARRIER") {
                            SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.push(value);
                        }
                    });
                    SenderCarrierCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        function GetDropDownList() {
            var typeCodeList = ["ManifestType"];
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
                        SenderCarrierCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        SenderCarrierCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function setSelectedRow(index,x) {
            angular.forEach(SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails,function(value,key){
                if(value.PK == x.PK){
                    SenderCarrierCtrl.ePage.Masters.selectedRow = key;
                }
            })
            SenderCarrierCtrl.ePage.Masters.LineselectedRow = index;
        }

        function Back() {
            var item = SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[SenderCarrierCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.splice(SenderCarrierCtrl.ePage.Masters.selectedRow, 1);
                        SenderCarrierCtrl.ePage.Masters.Lineslist = true;
                        SenderCarrierCtrl.ePage.Masters.selectedRow = SenderCarrierCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                SenderCarrierCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[SenderCarrierCtrl.ePage.Masters.selectedRow]);
            SenderCarrierCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            SenderCarrierCtrl.ePage.Masters.selectedRow = index;
            SenderCarrierCtrl.ePage.Masters.Lineslist = false;
            SenderCarrierCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (SenderCarrierCtrl.ePage.Masters.selectedRow != -1) {
                if (SenderCarrierCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (SenderCarrierCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        SenderCarrierCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (SenderCarrierCtrl.ePage.Masters.selectedRow == SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.length - 1) {
                            return;
                        }
                        SenderCarrierCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[SenderCarrierCtrl.ePage.Masters.selectedRow]);
            var obj = {
                "PK": "",
                "MappingCode": item.MappingCode,
                "MappingForCode": item.MappingForCode,
                "MappingToCode": item.MappingToCode,
                "MappingTo_FK": item.MappingTo_FK,
                "MappingFor_FK": item.MappingFor_FK,
                "AddRef1_FK": item.AddRef1_FK,
                "AddRef1Code": item.AddRef1Code,
                "AddRef1Type": item.AddRef1Type,
                "IsDeleted": item.IsDeleted,
                "IsModified": item.IsModified
            };

            SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.splice(SenderCarrierCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            SenderCarrierCtrl.ePage.Masters.Edit(SenderCarrierCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[SenderCarrierCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", 'CfxMapping/Delete/' + item.PK).then(function SuccessCallback(response) {
                        toastr.success('Record Removed Successfully');
                        if (response.data.Response == "Success") {
                            SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails = [];
                            getCfxMappingDetails();
                        }
                    });
                    SenderCarrierCtrl.ePage.Masters.selectedRow = SenderCarrierCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "MappingCode": "SENDER_CARRIER",
                "MappingForCode": "",
                "MappingToCode": "",
                "MappingTo_FK": "",
                "MappingFor_FK": "",
                "AddRef1_FK": "",
                "AddRef1Code": "",
                "AddRef1Type": "ManifestType",
                "IsDeleted": false,
                "IsModified": false
            };
            SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.push(obj);
            SenderCarrierCtrl.ePage.Masters.Edit(SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.AddRef1Code && $item.MappingForCode && $item.MappingToCode) {
                if ($item.PK) {
                    $item.IsModified = true;
                    SenderCarrierCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", SenderCarrierCtrl.ePage.Entities.Header.API.UpdateCfxMapping.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[SenderCarrierCtrl.ePage.Masters.selectedRow] = response.data.Response;
                        }
                    });
                } else {
                    SenderCarrierCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", SenderCarrierCtrl.ePage.Entities.Header.API.InsertCfxMapping.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            SenderCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[SenderCarrierCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                        }
                    });
                }
                getCfxMappingDetails();
            } else {
                toastr.warning("All Mapping details are mandatory")
            }
        }

        Init();
    }
})();
