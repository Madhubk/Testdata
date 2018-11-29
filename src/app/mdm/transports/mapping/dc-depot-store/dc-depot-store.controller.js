(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DcDepotStoreController", DcDepotStoreController);

    DcDepotStoreController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "appConfig", "toastr", "$document", "confirmation", "$filter", "$injector", "dynamicLookupConfig"];

    function DcDepotStoreController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, mappingConfig, appConfig, toastr, $document, confirmation, $filter, $injector, dynamicLookupConfig) {
        /* jshint validthis: true */
        var DcDepotStoreCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            DcDepotStoreCtrl.ePage = {
                "Title": "",
                "Prefix": "Dc_Depot_Store",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };
            DcDepotStoreCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            DcDepotStoreCtrl.ePage.Masters.DropDownMasterList = {};
            DcDepotStoreCtrl.ePage.Masters.emptyText = '-'
            DcDepotStoreCtrl.ePage.Masters.selectedRow = -1;
            DcDepotStoreCtrl.ePage.Masters.Lineslist = true;
            DcDepotStoreCtrl.ePage.Masters.HeaderName = '';

            DcDepotStoreCtrl.ePage.Masters.Edit = Edit;
            DcDepotStoreCtrl.ePage.Masters.CopyRow = CopyRow;
            DcDepotStoreCtrl.ePage.Masters.AddNewRow = AddNewRow;
            DcDepotStoreCtrl.ePage.Masters.RemoveRow = RemoveRow;
            DcDepotStoreCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            DcDepotStoreCtrl.ePage.Masters.Back = Back;
            DcDepotStoreCtrl.ePage.Masters.Done = Done;
            DcDepotStoreCtrl.ePage.Masters.getCfxMappingDetails = getCfxMappingDetails;

            DcDepotStoreCtrl.ePage.Masters.Config = mappingConfig;
            DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails = [];
            DcDepotStoreCtrl.ePage.Meta.IsLoading = false;

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
                    DcDepotStoreCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function getCfxMappingDetails() {
            angular.forEach(DcDepotStoreCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                if (value.MappingCode == "DC_DEPOT_STORE") {
                    DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails.push(value);
                }
            });
        }

        function setSelectedRow(index,x) {
            angular.forEach(DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails,function(value,key){
                if(value.PK == x.PK){
                    DcDepotStoreCtrl.ePage.Masters.selectedRow = key;        
                }
            })
            DcDepotStoreCtrl.ePage.Masters.LineselectedRow = index;
        }

        function Back() {
            var item = DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails[DcDepotStoreCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails.splice(DcDepotStoreCtrl.ePage.Masters.selectedRow, 1);
                        DcDepotStoreCtrl.ePage.Masters.Lineslist = true;
                        DcDepotStoreCtrl.ePage.Masters.selectedRow = DcDepotStoreCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                DcDepotStoreCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails[DcDepotStoreCtrl.ePage.Masters.selectedRow]);
            DcDepotStoreCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            DcDepotStoreCtrl.ePage.Masters.selectedRow = index;
            DcDepotStoreCtrl.ePage.Masters.Lineslist = false;
            DcDepotStoreCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (DcDepotStoreCtrl.ePage.Masters.selectedRow != -1) {
                if (DcDepotStoreCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (DcDepotStoreCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        DcDepotStoreCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (DcDepotStoreCtrl.ePage.Masters.selectedRow == DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails.length - 1) {
                            return;
                        }
                        DcDepotStoreCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails[DcDepotStoreCtrl.ePage.Masters.selectedRow]);
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

            DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails.splice(DcDepotStoreCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            DcDepotStoreCtrl.ePage.Masters.Edit(DcDepotStoreCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails[DcDepotStoreCtrl.ePage.Masters.selectedRow]
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
                    DcDepotStoreCtrl.ePage.Masters.selectedRow = DcDepotStoreCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "MappingCode": "DC_DEPOT_STORE",
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

            DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails.push(obj);
            DcDepotStoreCtrl.ePage.Masters.Edit(DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.MappingForCode && $item.MappingToCode) {
                if ($item.PK) {
                    $item.IsModified = true;
                    DcDepotStoreCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", DcDepotStoreCtrl.ePage.Entities.Header.API.UpdateCfxMapping.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails[DcDepotStoreCtrl.ePage.Masters.selectedRow] = response.data.Response;
                        }
                    });
                } else {
                    DcDepotStoreCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", DcDepotStoreCtrl.ePage.Entities.Header.API.InsertCfxMapping.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails[DcDepotStoreCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                        }
                    });
                }
                getCfxMappingDetail();
            } else {
                toastr.warning("Dont leave any fields Empty")
            }
        }

        function getCfxMappingDetail() {
            DcDepotStoreCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": DcDepotStoreCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", DcDepotStoreCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DcDepotStoreCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues = response.data.Response;
                    DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails = [];
                    angular.forEach(DcDepotStoreCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                        if (value.MappingCode == "DC_DEPOT_STORE") {
                            DcDepotStoreCtrl.ePage.Entities.Header.Data.DcDepotStoreDetails.push(value);
                        }
                    });
                    DcDepotStoreCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }
})();
