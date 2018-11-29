(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SenderReceiverConsController", SenderReceiverConsController);

    SenderReceiverConsController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "appConfig", "toastr", "$document", "confirmation", "$filter", "$injector", "dynamicLookupConfig"];

    function SenderReceiverConsController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, mappingConfig, appConfig, toastr, $document, confirmation, $filter, $injector, dynamicLookupConfig) {
        /* jshint validthis: true */
        var SenderReceiverConsCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SenderReceiverConsCtrl.ePage = {
                "Title": "",
                "Prefix": "Sender_Receiver",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };
            SenderReceiverConsCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            SenderReceiverConsCtrl.ePage.Masters.DropDownMasterList = {};
            SenderReceiverConsCtrl.ePage.Masters.emptyText = '-'
            SenderReceiverConsCtrl.ePage.Masters.selectedRow = -1;
            SenderReceiverConsCtrl.ePage.Masters.Lineslist = true;
            SenderReceiverConsCtrl.ePage.Masters.HeaderName = '';

            SenderReceiverConsCtrl.ePage.Masters.Edit = Edit;
            SenderReceiverConsCtrl.ePage.Masters.CopyRow = CopyRow;
            SenderReceiverConsCtrl.ePage.Masters.AddNewRow = AddNewRow;
            SenderReceiverConsCtrl.ePage.Masters.RemoveRow = RemoveRow;
            SenderReceiverConsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            SenderReceiverConsCtrl.ePage.Masters.Back = Back;
            SenderReceiverConsCtrl.ePage.Masters.Done = Done;
            SenderReceiverConsCtrl.ePage.Masters.getCfxMappingDetails = getCfxMappingDetails;
            SenderReceiverConsCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;

            SenderReceiverConsCtrl.ePage.Masters.Config = mappingConfig;
            SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails = [];
            SenderReceiverConsCtrl.ePage.Meta.IsLoading = false;

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
                    SenderReceiverConsCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function OnChangeServiceType(ServiceType) {
            angular.forEach(SenderReceiverConsCtrl.ePage.Masters.DropDownMasterList.ServiceType.ListSource, function (value, key) {
                if (value.Key == ServiceType) {
                    SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverConsCtrl.ePage.Masters.selectedRow].AddRef1_FK = value.PK;
                    SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverConsCtrl.ePage.Masters.selectedRow].AddRef1Code = value.Key;
                }
            });
        }

        function GetDropDownList() {
            var typeCodeList = ["servicetypes"];
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
                        SenderReceiverConsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        SenderReceiverConsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function getCfxMappingDetails() {
            angular.forEach(SenderReceiverConsCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                if (value.MappingCode == "SENDER_RECEIVER") {
                    SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.push(value);
                }
            });
        }

        function setSelectedRow(index,x) {
            angular.forEach(SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails,function(value,key){
                if(x.PK == value.PK){
                    SenderReceiverConsCtrl.ePage.Masters.selectedRow = key;        
                }
            })
            SenderReceiverConsCtrl.ePage.Masters.LineselectedRow = index;
        }

        function Back() {
            var item = SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverConsCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.splice(SenderReceiverConsCtrl.ePage.Masters.selectedRow, 1);
                        SenderReceiverConsCtrl.ePage.Masters.Lineslist = true;
                        SenderReceiverConsCtrl.ePage.Masters.selectedRow = SenderReceiverConsCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                SenderReceiverConsCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverConsCtrl.ePage.Masters.selectedRow]);
            SenderReceiverConsCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            SenderReceiverConsCtrl.ePage.Masters.selectedRow = index;
            SenderReceiverConsCtrl.ePage.Masters.Lineslist = false;
            SenderReceiverConsCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (SenderReceiverConsCtrl.ePage.Masters.selectedRow != -1) {
                if (SenderReceiverConsCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (SenderReceiverConsCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        SenderReceiverConsCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (SenderReceiverConsCtrl.ePage.Masters.selectedRow == SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.length - 1) {
                            return;
                        }
                        SenderReceiverConsCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverConsCtrl.ePage.Masters.selectedRow]);
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

            SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.splice(SenderReceiverConsCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            SenderReceiverConsCtrl.ePage.Masters.Edit(SenderReceiverConsCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverConsCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", 'CfxMapping/Delete/' + item.PK).then(function (response) {
                        toastr.success('Record Removed Successfully');
                        getCfxMappingDetail();
                    });
                    SenderReceiverConsCtrl.ePage.Masters.selectedRow = SenderReceiverConsCtrl.ePage.Masters.selectedRow - 1;
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
                "AddRef1Type": "ServiceType",
                "IsDeleted": false,
                "IsModified": false
            };

            SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.push(obj);
            SenderReceiverConsCtrl.ePage.Masters.Edit(SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.MappingForCode && $item.AddRef1Code && $item.MappingToCode) {
                if ($item.PK) {
                    $item.IsModified = true;
                    SenderReceiverConsCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", SenderReceiverConsCtrl.ePage.Entities.Header.API.UpdateCfxMapping.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverConsCtrl.ePage.Masters.selectedRow] = response.data.Response;
                        }
                    });
                } else {
                    SenderReceiverConsCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", SenderReceiverConsCtrl.ePage.Entities.Header.API.InsertCfxMapping.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails[SenderReceiverConsCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                        }
                    });
                }
                getCfxMappingDetail();
            } else {
                toastr.warning("Dont leave any fields Empty")
            }
        }

        function getCfxMappingDetail() {
            SenderReceiverConsCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SenderReceiverConsCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", SenderReceiverConsCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    SenderReceiverConsCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues = response.data.Response;
                    SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails = [];
                    angular.forEach(SenderReceiverConsCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                        if (value.MappingCode == "SENDER_RECEIVER") {
                            SenderReceiverConsCtrl.ePage.Entities.Header.Data.SenderReceiverDetails.push(value);
                        }
                    });
                    SenderReceiverConsCtrl.ePage.Masters.IsLoading = false;
                    console.log(SenderReceiverConsCtrl.ePage.Masters.Lineslist)
                }
            });
        }

        Init();
    }
})();
