(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ServiceTypeController", ServiceTypeController);

    ServiceTypeController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function ServiceTypeController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, mappingConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var ServiceTypeCtrl = this;

        function Init() {
            ServiceTypeCtrl.ePage = {
                "Title": "",
                "Prefix": "SENDER_SERVICETYPE",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };

            ServiceTypeCtrl.ePage.Masters.DropDownMasterList = {};
            ServiceTypeCtrl.ePage.Masters.emptyText = '-'
            ServiceTypeCtrl.ePage.Masters.selectedRow = -1;
            ServiceTypeCtrl.ePage.Masters.Lineslist = true;
            ServiceTypeCtrl.ePage.Masters.HeaderName = '';

            ServiceTypeCtrl.ePage.Masters.Edit = Edit;
            ServiceTypeCtrl.ePage.Masters.CopyRow = CopyRow;
            ServiceTypeCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ServiceTypeCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ServiceTypeCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ServiceTypeCtrl.ePage.Masters.Back = Back;
            ServiceTypeCtrl.ePage.Masters.Done = Done;
            ServiceTypeCtrl.ePage.Masters.getCfxMappingDetails = getCfxMappingDetails;
            ServiceTypeCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;
            ServiceTypeCtrl.ePage.Masters.SelectedLookupDataSender = SelectedLookupDataSender;

            ServiceTypeCtrl.ePage.Masters.Config = mappingConfig;
            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails = [];
            ServiceTypeCtrl.ePage.Meta.IsLoading = false;

            // GetCfxTypeList();
        }
        function GetCfxTypeList(type) {
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
                        ServiceTypeCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ServiceTypeCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                        if (value == 'servicetypes') {
                            if (type == 'STS') {
                                ServiceTypeCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource = $filter('filter')(ServiceTypeCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, function (value1, key1) {
                                    return value1.Key == "STS" || value1.Key == "PFR";
                                });
                            } else if (type == 'ADH') {
                                ServiceTypeCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource = $filter('filter')(ServiceTypeCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, function (value1, key1) {
                                    return value1.Key == "ADH";
                                });
                            } else if (type == 'All') {
                                ServiceTypeCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource = ServiceTypeCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource;
                            }
                        }
                    });
                }
            });
        }

        function OnChangeServiceType(item) {
            angular.forEach(ServiceTypeCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, function (value, key) {
                if (value.Key == item) {
                    ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow].AddRef1Code = value.Key;
                    ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow].AddRef1_FK = value.PK;
                }
            });
        }

        function getCfxMappingDetails() {
            angular.forEach(ServiceTypeCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                if (value.MappingCode == "SENDER_SERVICETYPE") {
                    ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails.push(value);
                }
            });
        }

        function setSelectedRow(index,x) {
            angular.forEach(ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails,function(value,key){
                if(value.PK == x.PK){
                    ServiceTypeCtrl.ePage.Masters.selectedRow = key;
                }
            })
            ServiceTypeCtrl.ePage.Masters.LinesselectedRow = index;
        }

        function Back() {
            var item = ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails.splice(ServiceTypeCtrl.ePage.Masters.selectedRow, 1);
                        ServiceTypeCtrl.ePage.Masters.Lineslist = true;
                        ServiceTypeCtrl.ePage.Masters.selectedRow = ServiceTypeCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                ServiceTypeCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow]);
            ServiceTypeCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            ServiceTypeCtrl.ePage.Masters.selectedRow = index;
            ServiceTypeCtrl.ePage.Masters.Lineslist = false;
            ServiceTypeCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (ServiceTypeCtrl.ePage.Masters.selectedRow != -1) {
                if (ServiceTypeCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ServiceTypeCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ServiceTypeCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ServiceTypeCtrl.ePage.Masters.selectedRow == ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails.length - 1) {
                            return;
                        }
                        ServiceTypeCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow]);
            var obj = {
                "PK": "",
                "MappingCode": item.MappingCode,
                "MappingForCode": item.MappingForCode,
                // "MappingToCode": item.MappingToCode,
                // "MappingTo_FK": item.MappingTo_FK,
                "MappingFor_FK": item.MappingFor_FK,
                "AddRef1_FK": item.AddRef1_FK,
                "AddRef1Code": item.AddRef1Code,
                "AddRef1Type": item.AddRef1Type,
                "IsDeleted": item.IsDeleted,
                "IsModified": item.IsModified
            };

            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails.splice(ServiceTypeCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ServiceTypeCtrl.ePage.Masters.Edit(ServiceTypeCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow]
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
                    ServiceTypeCtrl.ePage.Masters.selectedRow = ServiceTypeCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function SelectedLookupDataSender(sender) {
            if (sender.IsDistributionCentre || sender.IsRoadFreightDepot) {
                GetCfxTypeList('ADH')
            } else if (sender.IsStore) {
                GetCfxTypeList('STS')
            } else {
                GetCfxTypeList('all')
            }

        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "MappingCode": "SENDER_SERVICETYPE",
                "MappingForCode": "",
                // "MappingToCode": "",
                // "MappingTo_FK": "",
                "MappingFor_FK": "",
                "AddRef1_FK": "",
                "AddRef1Code": "",
                "AddRef1Type": "",
                "IsDeleted": false,
                "IsModified": false
            };

            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails.push(obj);
            ServiceTypeCtrl.ePage.Masters.Edit(ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.MappingForCode && $item.AddRef1Code) {
                if ($item.PK) {
                    $item.IsModified = true;
                    ServiceTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ServiceTypeCtrl.ePage.Entities.Header.API.UpdateCfxMapping.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow] = response.data.Response;
                        }
                    });
                } else {
                    ServiceTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ServiceTypeCtrl.ePage.Entities.Header.API.InsertCfxMapping.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                        }
                    });
                }
                getCfxMappingDetail();
            } else {
                toastr.warning("Dont leave any fields Empty")
            }
        }
        function getCfxMappingDetail() {
            ServiceTypeCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ServiceTypeCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", ServiceTypeCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ServiceTypeCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues = response.data.Response;
                    ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails = [];
                    angular.forEach(ServiceTypeCtrl.ePage.Entities.Header.CheckPoints.CfxMappingValues, function (value, key) {
                        if (value.MappingCode == "SENDER_SERVICETYPE") {
                            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails.push(value);
                        }
                    });
                    ServiceTypeCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }
})();
