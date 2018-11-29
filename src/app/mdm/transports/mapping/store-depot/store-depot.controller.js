(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StoreDepotController", StoreDepotController);

    StoreDepotController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "appConfig", "toastr", "$document", "confirmation", "$filter", "$injector", "dynamicLookupConfig"];

    function StoreDepotController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, mappingConfig, appConfig, toastr, $document, confirmation, $filter, $injector, dynamicLookupConfig) {
        /* jshint validthis: true */
        var StoreDepotCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            StoreDepotCtrl.ePage = {
                "Title": "",
                "Prefix": "Store_Depot",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };
            StoreDepotCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            StoreDepotCtrl.ePage.Masters.DropDownMasterList = {};
            StoreDepotCtrl.ePage.Masters.emptyText = '-'
            StoreDepotCtrl.ePage.Masters.selectedRow = -1;
            StoreDepotCtrl.ePage.Masters.Lineslist = true;
            StoreDepotCtrl.ePage.Masters.HeaderName = '';

            StoreDepotCtrl.ePage.Masters.Edit = Edit;
            StoreDepotCtrl.ePage.Masters.CopyRow = CopyRow;
            StoreDepotCtrl.ePage.Masters.AddNewRow = AddNewRow;
            StoreDepotCtrl.ePage.Masters.RemoveRow = RemoveRow;
            StoreDepotCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            StoreDepotCtrl.ePage.Masters.Back = Back;
            StoreDepotCtrl.ePage.Masters.Done = Done;
            StoreDepotCtrl.ePage.Masters.getCfxMappingDetails = getCfxMappingDetails;

            StoreDepotCtrl.ePage.Masters.Config = mappingConfig;
            StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails = [];
            StoreDepotCtrl.ePage.Meta.IsLoading = false;

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
                    StoreDepotCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function getCfxMappingDetails() {
            angular.forEach(StoreDepotCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                if (value.MappingCode == "STORE_DEPOT") {
                    StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails.push(value);
                }
            });
        }

        function setSelectedRow(index, x) {
            angular.forEach(StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails,function(value,key){
                if(x.PK == value.PK){
                    StoreDepotCtrl.ePage.Masters.selectedRow = key;
                }
            })
            StoreDepotCtrl.ePage.Masters.LineselectedRow = index;
        }

        function Back() {
            var item = StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails[StoreDepotCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails.splice(StoreDepotCtrl.ePage.Masters.selectedRow, 1);
                        StoreDepotCtrl.ePage.Masters.Lineslist = true;
                        StoreDepotCtrl.ePage.Masters.selectedRow = StoreDepotCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                StoreDepotCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails[StoreDepotCtrl.ePage.Masters.selectedRow]);
            StoreDepotCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            StoreDepotCtrl.ePage.Masters.selectedRow = index;
            StoreDepotCtrl.ePage.Masters.Lineslist = false;
            StoreDepotCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (StoreDepotCtrl.ePage.Masters.selectedRow != -1) {
                if (StoreDepotCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (StoreDepotCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        StoreDepotCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (StoreDepotCtrl.ePage.Masters.selectedRow == StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails.length - 1) {
                            return;
                        }
                        StoreDepotCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails[StoreDepotCtrl.ePage.Masters.selectedRow]);
            var obj = {
                "PK": "",
                "MappingCode": item.MappingCode,
                "MappingForCode": item.MappingForCode,
                "MappingToCode": item.MappingToCode,
                "MappingBasedOnCode": item.MappingBasedOnCode,
                "MappingBasedOn_FK": item.MappingBasedOn_FK,
                "MappingTo_FK": item.MappingTo_FK,
                "MappingFor_FK": item.MappingFor_FK,
                "AddRef1_FK": item.AddRef1_FK,
                "AddRef1Code": item.AddRef1Code,
                "AddRef1Type": item.AddRef1Type,
                "IsDeleted": item.IsDeleted,
                "IsModified": item.IsModified
            };

            StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails.splice(StoreDepotCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            StoreDepotCtrl.ePage.Masters.Edit(StoreDepotCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails[StoreDepotCtrl.ePage.Masters.selectedRow]
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
                    StoreDepotCtrl.ePage.Masters.selectedRow = StoreDepotCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "MappingCode": "STORE_DEPOT",
                "MappingForCode": "",
                "MappingToCode": "",
                "MappingTo_FK": "",
                "MappingBasedOnCode": "",
                "MappingBasedOn_FK": "",
                "MappingFor_FK": "",
                "AddRef1_FK": "",
                "AddRef1Code": "",
                "AddRef1Type": "",
                "IsDeleted": false,
                "IsModified": false
            };

            StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails.push(obj);
            StoreDepotCtrl.ePage.Masters.Edit(StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.MappingForCode && $item.MappingToCode && $item.MappingBasedOnCode) {
                if ($item.PK) {
                    $item.IsModified = true;
                    StoreDepotCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", StoreDepotCtrl.ePage.Entities.Header.API.UpdateCfxMapping.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails[StoreDepotCtrl.ePage.Masters.selectedRow] = response.data.Response;
                        }
                    });
                } else {
                    StoreDepotCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", StoreDepotCtrl.ePage.Entities.Header.API.InsertCfxMapping.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails[StoreDepotCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                        }
                    });
                }
                getCfxMappingDetail();
            } else {
                toastr.warning("Dont leave any fields Empty")
            }
        }

        function getCfxMappingDetail() {
            StoreDepotCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": StoreDepotCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", StoreDepotCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    StoreDepotCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues = response.data.Response;
                    StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails = [];
                    angular.forEach(StoreDepotCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                        if (value.MappingCode == "STORE_DEPOT") {
                            StoreDepotCtrl.ePage.Entities.Header.Data.StoreDepotDetails.push(value);
                        }
                    });
                    StoreDepotCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }
})();
