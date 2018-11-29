(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LevelLoadController", LevelLoadController);

    LevelLoadController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "typeConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function LevelLoadController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, typeConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var LevelLoadTypeCtrl = this;

        function Init() {
            LevelLoadTypeCtrl.ePage = {
                "Title": "",
                "Prefix": "LevelLoadType",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": typeConfig.Entities
            };

            LevelLoadTypeCtrl.ePage.Masters.DropDownMasterList = {};
            LevelLoadTypeCtrl.ePage.Masters.emptyText = '-'
            LevelLoadTypeCtrl.ePage.Masters.selectedRow = -1;
            LevelLoadTypeCtrl.ePage.Masters.Lineslist = true;
            LevelLoadTypeCtrl.ePage.Masters.HeaderName = '';

            LevelLoadTypeCtrl.ePage.Masters.Edit = Edit;
            LevelLoadTypeCtrl.ePage.Masters.CopyRow = CopyRow;
            LevelLoadTypeCtrl.ePage.Masters.AddNewRow = AddNewRow;
            LevelLoadTypeCtrl.ePage.Masters.RemoveRow = RemoveRow;
            LevelLoadTypeCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            LevelLoadTypeCtrl.ePage.Masters.Back = Back;
            LevelLoadTypeCtrl.ePage.Masters.Done = Done;
            LevelLoadTypeCtrl.ePage.Masters.Config = typeConfig;
            LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails = [];
            LevelLoadTypeCtrl.ePage.Meta.IsLoading = false;

            GetCfxTypeList();
        }

        function GetCfxTypeList(type) {
            var typeCodeList = ["LevelLoadType"];
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
                    LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails = response.data.Response.LevelLoadType;
                }
            });
        }

        function setSelectedRow(index,x) {
            angular.forEach(LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails,function(value,key){
                if(value.PK == x.PK){
                    LevelLoadTypeCtrl.ePage.Masters.selectedRow = key;
                }
            })
            LevelLoadTypeCtrl.ePage.Masters.LinesselectedRow = index;
        }

        function Back() {
            var item = LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails[LevelLoadTypeCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails.splice(LevelLoadTypeCtrl.ePage.Masters.selectedRow, 1);
                        LevelLoadTypeCtrl.ePage.Masters.Lineslist = true;
                        LevelLoadTypeCtrl.ePage.Masters.selectedRow = LevelLoadTypeCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                LevelLoadTypeCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails[LevelLoadTypeCtrl.ePage.Masters.selectedRow]);
            LevelLoadTypeCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            LevelLoadTypeCtrl.ePage.Masters.selectedRow = index;
            LevelLoadTypeCtrl.ePage.Masters.Lineslist = false;
            LevelLoadTypeCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (LevelLoadTypeCtrl.ePage.Masters.selectedRow != -1) {
                if (LevelLoadTypeCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (LevelLoadTypeCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        LevelLoadTypeCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (LevelLoadTypeCtrl.ePage.Masters.selectedRow == LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails.length - 1) {
                            return;
                        }
                        LevelLoadTypeCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails[LevelLoadTypeCtrl.ePage.Masters.selectedRow]);
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

            LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails.splice(LevelLoadTypeCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            LevelLoadTypeCtrl.ePage.Masters.Edit(LevelLoadTypeCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails[LevelLoadTypeCtrl.ePage.Masters.selectedRow]
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
                    LevelLoadTypeCtrl.ePage.Masters.selectedRow = LevelLoadTypeCtrl.ePage.Masters.selectedRow - 1;
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

            LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails.push(obj);
            LevelLoadTypeCtrl.ePage.Masters.Edit(LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.Key && $item.Value) {
                if ($item.PK) {
                    $item.IsModified = true;
                    LevelLoadTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", LevelLoadTypeCtrl.ePage.Entities.Header.API.UpdateCfxTypes.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails[LevelLoadTypeCtrl.ePage.Masters.selectedRow] = response.data.Response;
                            toastr.success("Saved Successfully")
                        }
                    });
                } else {
                    LevelLoadTypeCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", LevelLoadTypeCtrl.ePage.Entities.Header.API.InsertCfxTypes.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            LevelLoadTypeCtrl.ePage.Entities.Header.Data.LevelLoadTypeDetails[LevelLoadTypeCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
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
