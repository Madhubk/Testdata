(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ServiceTypeController", ServiceTypeController);

    ServiceTypeController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "typeConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function ServiceTypeController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, typeConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var ServiceTypeCtrl = this;

        function Init() {
            ServiceTypeCtrl.ePage = {
                "Title": "",
                "Prefix": "SERVICETYPE",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": typeConfig.Entities
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
            ServiceTypeCtrl.ePage.Masters.Config = typeConfig;
            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails = [];
            ServiceTypeCtrl.ePage.Meta.IsLoading = false;

            GetCfxTypeList();
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
                    ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails = response.data.Response.servicetypes;
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
                "PK": item.PK,
                "TypeCode": "servicetypes",
                "Key"     : item.Key,
                "Value"   : item.Value,
                "IsActive":  1,    
                "TenantCode": "SPOTL",
                "Module": "TMS",
                "Group": "Transport"
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
                    apiService.get("eAxisAPI", 'CfxTypes/Delete/' + item.PK +'/'+item.SAP_FK).then(function (response) {
                        toastr.success('Record Removed Successfully');
                        GetCfxTypeList()
                    });
                    ServiceTypeCtrl.ePage.Masters.selectedRow = ServiceTypeCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "TypeCode": "servicetypes",
                "Key"     : "",
                "Value"   : "",
                "IsActive":  1,    
                "TenantCode": "SPOTL",
                "Module": "TMS",
                "Group": "Transport"
            };

            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails.push(obj);
            ServiceTypeCtrl.ePage.Masters.Edit(ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.Key && $item.Value) {
                if ($item.PK) {
                    $item.IsModified = true;
                    ServiceTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ServiceTypeCtrl.ePage.Entities.Header.API.UpdateCfxTypes.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow] = response.data.Response;
                            toastr.success("Saved Successfully")
                        }
                    });
                } else {
                    ServiceTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ServiceTypeCtrl.ePage.Entities.Header.API.InsertCfxTypes.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ServiceTypeCtrl.ePage.Entities.Header.Data.ServiceTypeDetails[ServiceTypeCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                            toastr.success("Saved Successfully")
                        }
                    });
                }
                
            } else {
                toastr.warning("Dont leave any fields Empty")
            }
        }

        Init();
    }
})();
