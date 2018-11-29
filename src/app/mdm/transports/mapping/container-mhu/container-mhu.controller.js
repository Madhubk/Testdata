(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerMhuController", ContainerMhuController);

    ContainerMhuController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function ContainerMhuController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, mappingConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var ContainerMhuCtrl = this;

        function Init() {
            ContainerMhuCtrl.ePage = {
                "Title": "",
                "Prefix": "Container_MHU",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };

            ContainerMhuCtrl.ePage.Masters.DropDownMasterList = {};
            ContainerMhuCtrl.ePage.Masters.emptyText = '-'
            ContainerMhuCtrl.ePage.Masters.selectedRow = -1;
            ContainerMhuCtrl.ePage.Masters.Lineslist = true;
            ContainerMhuCtrl.ePage.Masters.HeaderName = '';

            ContainerMhuCtrl.ePage.Masters.Edit = Edit;
            ContainerMhuCtrl.ePage.Masters.CopyRow = CopyRow;
            ContainerMhuCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ContainerMhuCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ContainerMhuCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ContainerMhuCtrl.ePage.Masters.Back = Back;
            ContainerMhuCtrl.ePage.Masters.Done = Done;
            ContainerMhuCtrl.ePage.Masters.SelectedLookupItem = SelectedLookupItem;
            ContainerMhuCtrl.ePage.Masters.OnChangeVehicleType = OnChangeVehicleType;

            ContainerMhuCtrl.ePage.Masters.Config = mappingConfig;
            ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails = [];
            ContainerMhuCtrl.ePage.Meta.IsLoading = false;
            
            getContainerMHUMapping()
            MHUList()
            ContainerList()
        }
        function MHUList() {
            var _filter = {
                "SortColumn": "OSP_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 250
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGSUPP"
            };
            apiService.post("eAxisAPI", "PrdProduct/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ContainerMhuCtrl.ePage.Masters.MHUList = response.data.Response;
                }
            });
        }

        function OnChangeVehicleType(item) {
            angular.forEach(ContainerMhuCtrl.ePage.Masters.ContainerList, function (value, key) {
                if (value.Code == item) {
                    ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow].CNM_Code = value.Code;
                    ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow].CNM_FK = value.PK;
                }
            });
        }

        function SelectedLookupItem(item){
            if (item.data) {
                ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow].OSP_Code = item.data.entity.ProductCode;
                ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow].OSP_FK = item.data.entity.PK;
            } else {
                ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow].OSP_FK  = item.PK;
                ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow].OSP_Code = item.Name;
            }
        }

        function ContainerList() {
            var _filter = {
                "SortColumn": "CNM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 250
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "MSTCNT"
            };
            apiService.post("eAxisAPI", "mstContainer/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ContainerMhuCtrl.ePage.Masters.ContainerList = response.data.Response;
                }
            });
        }


        function setSelectedRow(index, x) {
            //ContainerMhuCtrl.ePage.Masters.selectedRow = index;
            ContainerMhuCtrl.ePage.Masters.selectedRowPK = x.PK;
            angular.forEach(ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails,function(value,key){
                if(value.PK == x.PK){
                    ContainerMhuCtrl.ePage.Masters.selectedRow = key;
                }                
            })
            ContainerMhuCtrl.ePage.Masters.LineselectedRow = index;
        }

        function Back() {
            var item = ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails.splice(ContainerMhuCtrl.ePage.Masters.selectedRow, 1);
                        ContainerMhuCtrl.ePage.Masters.Lineslist = true;
                        ContainerMhuCtrl.ePage.Masters.selectedRow = ContainerMhuCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                ContainerMhuCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow]);
            ContainerMhuCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            ContainerMhuCtrl.ePage.Masters.selectedRow = index;
            console.log(ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow])
            ContainerMhuCtrl.ePage.Masters.Lineslist = false;
            ContainerMhuCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (ContainerMhuCtrl.ePage.Masters.selectedRow != -1) {
                if (ContainerMhuCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ContainerMhuCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ContainerMhuCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ContainerMhuCtrl.ePage.Masters.selectedRow == ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails.length - 1) {
                            return;
                        }
                        ContainerMhuCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow]);
            var obj = {
                "PK": item.PK,
                "CNM_FK":item.CNM_FK,
                "CNM_Code":item.CNM_Code,
                "OSP_FK":item.OSP_FK,
                "OSP_Code":item.OSP_Code,
                "MhuSize": item.MhuSize
            };

            ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails.splice(ContainerMhuCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ContainerMhuCtrl.ePage.Masters.Edit(ContainerMhuCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", 'ContainerMHUMapping/Delete/' + item.PK).then(function (response) {
                        toastr.success('Record Removed Successfully');
                        getContainerMHUMapping();
                    });
                    ContainerMhuCtrl.ePage.Masters.selectedRow = ContainerMhuCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "CNM_FK":"",
                "CNM_Code":"",
                "OSP_FK":"",
                "OSP_Code":"",
                "MhuSize":""
            };

            ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails.push(obj);
            ContainerMhuCtrl.ePage.Masters.Edit(ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.CNM_Code && $item.OSP_Code && $item.MhuSize) {
                if ($item.PK) {
                    $item.IsModified = true;
                    ContainerMhuCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ContainerMhuCtrl.ePage.Entities.Header.API.UpdateContainerMHUMapping.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow] = response.data.Response;
                        }
                    });
                } else {
                    ContainerMhuCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ContainerMhuCtrl.ePage.Entities.Header.API.InsertContainerMHUMapping.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails[ContainerMhuCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
                        }
                    });
                }
                getContainerMHUMapping();
            } else {
                toastr.warning("Dont leave any fields Empty")
            }
        }

        function getContainerMHUMapping() {
            ContainerMhuCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "SortColumn": "MCM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ContainerMhuCtrl.ePage.Entities.Header.API.ContainerMHUMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", ContainerMhuCtrl.ePage.Entities.Header.API.ContainerMHUMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ContainerMhuCtrl.ePage.Entities.Header.Data.ContainerMhuDetails = response.data.Response;
                    ContainerMhuCtrl.ePage.Masters.IsLoading = false;
                }
            });
        }

        Init();
    }
})();
