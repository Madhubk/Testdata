(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SenderReceiverController", SenderReceiverController);

    SenderReceiverController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "appConfig", "toastr", "$document", "confirmation", "$filter", "$injector", "dynamicLookupConfig"];

    function SenderReceiverController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, mappingConfig, appConfig, toastr, $document, confirmation, $filter, $injector, dynamicLookupConfig) {
        /* jshint validthis: true */
        var SenderReceiverCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SenderReceiverCtrl.ePage = {
                "Title": "",
                "Prefix": "Sender_Receiver",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };
            SenderReceiverCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            SenderReceiverCtrl.ePage.Masters.DropDownMasterList = {};
            SenderReceiverCtrl.ePage.Masters.emptyText = '-'
            SenderReceiverCtrl.ePage.Masters.selectedRow = -1;
            SenderReceiverCtrl.ePage.Masters.Lineslist = true;
            SenderReceiverCtrl.ePage.Masters.HeaderName = '';

            SenderReceiverCtrl.ePage.Masters.Edit = Edit;
            SenderReceiverCtrl.ePage.Masters.CopyRow = CopyRow;
            SenderReceiverCtrl.ePage.Masters.AddNewRow = AddNewRow;
            SenderReceiverCtrl.ePage.Masters.RemoveRow = RemoveRow;
            SenderReceiverCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            SenderReceiverCtrl.ePage.Masters.Back = Back;
            SenderReceiverCtrl.ePage.Masters.Done = Done;
            SenderReceiverCtrl.ePage.Masters.getCfxMappingDetails = getCfxMappingDetails;
            SenderReceiverCtrl.ePage.Masters.OnChangeManifestType = OnChangeManifestType;

            SenderReceiverCtrl.ePage.Masters.Config = mappingConfig;
            SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails = [];
            SenderReceiverCtrl.ePage.Meta.IsLoading = false;

            GetDropDownList();
        }

        // Get DataEntryNameList 
        function GetDynamicLookupConfig() {
            var DataEntryNameList = "OrganizationList";
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
                    SenderReceiverCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function OnChangeManifestType(ManifestType) {
            angular.forEach(SenderReceiverCtrl.ePage.Masters.DropDownMasterList.ManifestType.ListSource, function (value, key) {
                if (value.Key == ManifestType) {
                    SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverCtrl.ePage.Masters.selectedRow].AddRef1_FK = value.PK;
                    SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverCtrl.ePage.Masters.selectedRow].AddRef1Code = value.Key;
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
                        SenderReceiverCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        SenderReceiverCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function getCfxMappingDetails() {
            angular.forEach(SenderReceiverCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                if (value.MappingCode == "SENDER_RECEIVER") {
                    SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.push(value);
                }
            });
        }

        function setSelectedRow(index) {
            SenderReceiverCtrl.ePage.Masters.selectedRow = index;
        }

        function Back() {
            SenderReceiverCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {
            SaveList(SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverCtrl.ePage.Masters.selectedRow]);
            SenderReceiverCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            SenderReceiverCtrl.ePage.Masters.selectedRow = index;
            SenderReceiverCtrl.ePage.Masters.Lineslist = false;
            SenderReceiverCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (SenderReceiverCtrl.ePage.Masters.selectedRow != -1) {
                if (SenderReceiverCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (SenderReceiverCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        SenderReceiverCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (SenderReceiverCtrl.ePage.Masters.selectedRow == SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.length - 1) {
                            return;
                        }
                        SenderReceiverCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverCtrl.ePage.Masters.selectedRow]);
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

            SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.splice(SenderReceiverCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            SenderReceiverCtrl.ePage.Masters.Edit(SenderReceiverCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.splice(SenderReceiverCtrl.ePage.Masters.selectedRow, 1);
                    toastr.success('Record Removed Successfully');
                    SenderReceiverCtrl.ePage.Masters.Lineslist = true;
                    SenderReceiverCtrl.ePage.Masters.selectedRow = SenderReceiverCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "MappingCode": "SENDER_RECEIVER",
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

            SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.push(obj);
            SenderReceiverCtrl.ePage.Masters.Edit(SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.PK) {
                $item.IsModified = true;
                SenderReceiverCtrl.ePage.Masters.IsLoadingToSave = true;
                apiService.post("eAxisAPI", SenderReceiverCtrl.ePage.Entities.Header.API.UpdateCfxMapping.Url, $item).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverCtrl.ePage.Masters.selectedRow] = response.data.Response;
                    }
                });
            } else {
                SenderReceiverCtrl.ePage.Masters.IsLoadingToSave = true;
                apiService.post("eAxisAPI", SenderReceiverCtrl.ePage.Entities.Header.API.InsertCfxMapping.Url, [$item]).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        SenderReceiverCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                    }
                });
            }
        }

        Init();
    }
})();
