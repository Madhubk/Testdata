(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TagsController", TagsController);

    TagsController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "typeConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function TagsController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, typeConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var TagsCtrl = this;

        function Init() {
            TagsCtrl.ePage = {
                "Title": "",
                "Prefix": "TAGS",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": typeConfig.Entities
            };

            TagsCtrl.ePage.Masters.DropDownMasterList = {};
            TagsCtrl.ePage.Masters.emptyText = '-'
            TagsCtrl.ePage.Masters.selectedRow = -1;
            TagsCtrl.ePage.Masters.Lineslist = true;
            TagsCtrl.ePage.Masters.HeaderName = '';

            TagsCtrl.ePage.Masters.Edit = Edit;
            TagsCtrl.ePage.Masters.CopyRow = CopyRow;
            TagsCtrl.ePage.Masters.AddNewRow = AddNewRow;
            TagsCtrl.ePage.Masters.RemoveRow = RemoveRow;
            TagsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            TagsCtrl.ePage.Masters.Back = Back;
            TagsCtrl.ePage.Masters.Done = Done;
            TagsCtrl.ePage.Masters.Config = typeConfig;
            TagsCtrl.ePage.Entities.Header.Data.Tags = [];
            TagsCtrl.ePage.Meta.IsLoading = false;

            GetCfxTypeList();
        }

        function GetCfxTypeList(type) {
            var typeCodeList = ["Tags"];
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
                    TagsCtrl.ePage.Entities.Header.Data.Tags = response.data.Response.Tags;
                }
            });
        }

        function setSelectedRow(index,x) {
            angular.forEach(TagsCtrl.ePage.Entities.Header.Data.Tags,function(value,key){
                if(value.PK == x.PK){
                    TagsCtrl.ePage.Masters.selectedRow = key;
                }
            })
            TagsCtrl.ePage.Masters.LinesselectedRow = index;
        }

        function Back() {
            var item = TagsCtrl.ePage.Entities.Header.Data.Tags[TagsCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        TagsCtrl.ePage.Entities.Header.Data.Tags.splice(TagsCtrl.ePage.Masters.selectedRow, 1);
                        TagsCtrl.ePage.Masters.Lineslist = true;
                        TagsCtrl.ePage.Masters.selectedRow = TagsCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                TagsCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(TagsCtrl.ePage.Entities.Header.Data.Tags[TagsCtrl.ePage.Masters.selectedRow]);
            TagsCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            TagsCtrl.ePage.Masters.selectedRow = index;
            TagsCtrl.ePage.Masters.Lineslist = false;
            TagsCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (TagsCtrl.ePage.Masters.selectedRow != -1) {
                if (TagsCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (TagsCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        TagsCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (TagsCtrl.ePage.Masters.selectedRow == TagsCtrl.ePage.Entities.Header.Data.Tags.length - 1) {
                            return;
                        }
                        TagsCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(TagsCtrl.ePage.Entities.Header.Data.Tags[TagsCtrl.ePage.Masters.selectedRow]);
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

            TagsCtrl.ePage.Entities.Header.Data.Tags.splice(TagsCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            TagsCtrl.ePage.Masters.Edit(TagsCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = TagsCtrl.ePage.Entities.Header.Data.Tags[TagsCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", 'CfxType/Delete/' + item.PK +'/'+item.SAP_FK).then(function (response) {
                        toastr.success('Record Removed Successfully');
                        GetCfxTypeList()
                    });
                    TagsCtrl.ePage.Masters.selectedRow = TagsCtrl.ePage.Masters.selectedRow - 1;
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

            TagsCtrl.ePage.Entities.Header.Data.Tags.push(obj);
            TagsCtrl.ePage.Masters.Edit(TagsCtrl.ePage.Entities.Header.Data.Tags.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.Key && $item.Value) {
                if ($item.PK) {
                    $item.IsModified = true;
                    TagsCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", TagsCtrl.ePage.Entities.Header.API.UpdateCfxTypes.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            TagsCtrl.ePage.Entities.Header.Data.Tags[TagsCtrl.ePage.Masters.selectedRow] = response.data.Response;
                            toastr.success("Saved Successfully")
                        }
                    });
                } else {
                    TagsCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", TagsCtrl.ePage.Entities.Header.API.InsertCfxTypes.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            TagsCtrl.ePage.Entities.Header.Data.Tags[TagsCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
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
