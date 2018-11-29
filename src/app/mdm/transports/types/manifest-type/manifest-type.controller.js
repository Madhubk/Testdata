(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestTypeController", ManifestTypeController);

    ManifestTypeController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "typeConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function ManifestTypeController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, typeConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var ManifestTypeCtrl = this;

        function Init() {
            ManifestTypeCtrl.ePage = {
                "Title": "",
                "Prefix": "SERVICETYPE",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": typeConfig.Entities
            };

            ManifestTypeCtrl.ePage.Masters.DropDownMasterList = {};
            ManifestTypeCtrl.ePage.Masters.emptyText = '-'
            ManifestTypeCtrl.ePage.Masters.selectedRow = -1;
            ManifestTypeCtrl.ePage.Masters.Lineslist = true;
            ManifestTypeCtrl.ePage.Masters.HeaderName = '';

            ManifestTypeCtrl.ePage.Masters.Edit = Edit;
            ManifestTypeCtrl.ePage.Masters.CopyRow = CopyRow;
            ManifestTypeCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ManifestTypeCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ManifestTypeCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ManifestTypeCtrl.ePage.Masters.Back = Back;
            ManifestTypeCtrl.ePage.Masters.Done = Done;
            ManifestTypeCtrl.ePage.Masters.Config = typeConfig;
            ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails = [];
            ManifestTypeCtrl.ePage.Meta.IsLoading = false;

            GetCfxTypeList();
        }

        function GetCfxTypeList(type) {
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
                    ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails = response.data.Response.ManifestType;
                }
            });
        }

        function setSelectedRow(index,x) {
            angular.forEach(ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails,function(value,key){
                if(value.PK == x.PK){
                    ManifestTypeCtrl.ePage.Masters.selectedRow = key;
                }
            })
            ManifestTypeCtrl.ePage.Masters.LinesselectedRow = index;
        }

        function Back() {
            var item = ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails[ManifestTypeCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails.splice(ManifestTypeCtrl.ePage.Masters.selectedRow, 1);
                        ManifestTypeCtrl.ePage.Masters.Lineslist = true;
                        ManifestTypeCtrl.ePage.Masters.selectedRow = ManifestTypeCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                ManifestTypeCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails[ManifestTypeCtrl.ePage.Masters.selectedRow]);
            ManifestTypeCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            ManifestTypeCtrl.ePage.Masters.selectedRow = index;
            ManifestTypeCtrl.ePage.Masters.Lineslist = false;
            ManifestTypeCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (ManifestTypeCtrl.ePage.Masters.selectedRow != -1) {
                if (ManifestTypeCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ManifestTypeCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ManifestTypeCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ManifestTypeCtrl.ePage.Masters.selectedRow == ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails.length - 1) {
                            return;
                        }
                        ManifestTypeCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails[ManifestTypeCtrl.ePage.Masters.selectedRow]);
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

            ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails.splice(ManifestTypeCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ManifestTypeCtrl.ePage.Masters.Edit(ManifestTypeCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails[ManifestTypeCtrl.ePage.Masters.selectedRow]
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
                    ManifestTypeCtrl.ePage.Masters.selectedRow = ManifestTypeCtrl.ePage.Masters.selectedRow - 1;
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

            ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails.push(obj);
            ManifestTypeCtrl.ePage.Masters.Edit(ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.Key && $item.Value) {
                if ($item.PK) {
                    $item.IsModified = true;
                    ManifestTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ManifestTypeCtrl.ePage.Entities.Header.API.UpdateCfxTypes.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails[ManifestTypeCtrl.ePage.Masters.selectedRow] = response.data.Response;
                            toastr.success("Saved Successfully")
                        }
                    });
                } else {
                    ManifestTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ManifestTypeCtrl.ePage.Entities.Header.API.InsertCfxTypes.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ManifestTypeCtrl.ePage.Entities.Header.Data.ManifestTypeDetails[ManifestTypeCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
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
