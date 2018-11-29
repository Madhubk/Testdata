(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReceiverCarrierController", ReceiverCarrierController);

    ReceiverCarrierController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "appConfig", "toastr", "$document", "confirmation", "$filter", "$injector", "dynamicLookupConfig"];

    function ReceiverCarrierController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, mappingConfig, appConfig, toastr, $document, confirmation, $filter, $injector, dynamicLookupConfig) {
        /* jshint validthis: true */
        var ReceiverCarrierCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            ReceiverCarrierCtrl.ePage = {
                "Title": "",
                "Prefix": "Sender_Carrier",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };

            ReceiverCarrierCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            ReceiverCarrierCtrl.ePage.Masters.DropDownMasterList = {};
            ReceiverCarrierCtrl.ePage.Masters.emptyText = '-'
            ReceiverCarrierCtrl.ePage.Masters.selectedRow = -1;
            ReceiverCarrierCtrl.ePage.Masters.Lineslist = true;
            ReceiverCarrierCtrl.ePage.Masters.HeaderName = '';

            ReceiverCarrierCtrl.ePage.Masters.Edit = Edit;
            ReceiverCarrierCtrl.ePage.Masters.CopyRow = CopyRow;
            ReceiverCarrierCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ReceiverCarrierCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ReceiverCarrierCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ReceiverCarrierCtrl.ePage.Masters.Back = Back;
            ReceiverCarrierCtrl.ePage.Masters.Done = Done;

            ReceiverCarrierCtrl.ePage.Masters.OnChangeManifestType = OnChangeManifestType;

            ReceiverCarrierCtrl.ePage.Masters.Config = mappingConfig;

            ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails = [];

            ReceiverCarrierCtrl.ePage.Meta.IsLoading = false;

            GetDropDownList();
            getCfxMappingDetails();
            GetDynamicLookupConfig();
        }

        function OnChangeManifestType(ManifestType) {
            angular.forEach(ReceiverCarrierCtrl.ePage.Masters.DropDownMasterList.ManifestType.ListSource, function (value, key) {
                if (value.Key == ManifestType) {
                    ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[ReceiverCarrierCtrl.ePage.Masters.selectedRow].AddRef1_FK = value.PK;
                    ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[ReceiverCarrierCtrl.ePage.Masters.selectedRow].AddRef1Code = value.Key;
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
                    ReceiverCarrierCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function getCfxMappingDetails() {
            ReceiverCarrierCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ReceiverCarrierCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", ReceiverCarrierCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ReceiverCarrierCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues = response.data.Response;
                    ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails = [];
                    angular.forEach(ReceiverCarrierCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                        if (value.MappingCode == "SENDER_CARRIER") {
                            ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.push(value);
                        }
                    });
                    ReceiverCarrierCtrl.ePage.Masters.IsLoading = false;
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
                        ReceiverCarrierCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ReceiverCarrierCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function setSelectedRow(index,x) {
            angular.forEach(ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails,function(value,key){
                if(value.PK == x.PK){
                    ReceiverCarrierCtrl.ePage.Masters.selectedRow = key;
                }
            })
            ReceiverCarrierCtrl.ePage.Masters.LineselectedRow = index;
        }

        function Back() {
            var item = ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[ReceiverCarrierCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.splice(ReceiverCarrierCtrl.ePage.Masters.selectedRow, 1);
                        ReceiverCarrierCtrl.ePage.Masters.Lineslist = true;
                        ReceiverCarrierCtrl.ePage.Masters.selectedRow = ReceiverCarrierCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                ReceiverCarrierCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[ReceiverCarrierCtrl.ePage.Masters.selectedRow]);
            ReceiverCarrierCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            ReceiverCarrierCtrl.ePage.Masters.selectedRow = index;
            ReceiverCarrierCtrl.ePage.Masters.Lineslist = false;
            ReceiverCarrierCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (ReceiverCarrierCtrl.ePage.Masters.selectedRow != -1) {
                if (ReceiverCarrierCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ReceiverCarrierCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ReceiverCarrierCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ReceiverCarrierCtrl.ePage.Masters.selectedRow == ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.length - 1) {
                            return;
                        }
                        ReceiverCarrierCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[ReceiverCarrierCtrl.ePage.Masters.selectedRow]);
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

            ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.splice(ReceiverCarrierCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ReceiverCarrierCtrl.ePage.Masters.Edit(ReceiverCarrierCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[ReceiverCarrierCtrl.ePage.Masters.selectedRow]
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
                            ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails = [];
                            getCfxMappingDetails();
                        }
                    });
                    ReceiverCarrierCtrl.ePage.Masters.selectedRow = ReceiverCarrierCtrl.ePage.Masters.selectedRow - 1;
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
            ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.push(obj);
            ReceiverCarrierCtrl.ePage.Masters.Edit(ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.AddRef1Code && $item.MappingForCode && $item.MappingToCode) {
                if ($item.PK) {
                    $item.IsModified = true;
                    ReceiverCarrierCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ReceiverCarrierCtrl.ePage.Entities.Header.API.UpdateCfxMapping.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[ReceiverCarrierCtrl.ePage.Masters.selectedRow] = response.data.Response;
                        }
                    });
                } else {
                    ReceiverCarrierCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ReceiverCarrierCtrl.ePage.Entities.Header.API.InsertCfxMapping.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ReceiverCarrierCtrl.ePage.Entities.Header.Data.SenderCarrierDetails[ReceiverCarrierCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
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
