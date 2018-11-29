(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolEventController", ConsolEventController);

    ConsolEventController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "typeConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function ConsolEventController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, typeConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var ConsolEventCtrl = this;

        function Init() {
            ConsolEventCtrl.ePage = {
                "Title": "",
                "Prefix": "ConsolEvent",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": typeConfig.Entities
            };

            ConsolEventCtrl.ePage.Masters.DropDownMasterList = {};
            ConsolEventCtrl.ePage.Masters.emptyText = '-'
            ConsolEventCtrl.ePage.Masters.selectedRow = -1;
            ConsolEventCtrl.ePage.Masters.Lineslist = true;
            ConsolEventCtrl.ePage.Masters.HeaderName = '';

            ConsolEventCtrl.ePage.Masters.Edit = Edit;
            ConsolEventCtrl.ePage.Masters.CopyRow = CopyRow;
            ConsolEventCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ConsolEventCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ConsolEventCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConsolEventCtrl.ePage.Masters.Back = Back;
            ConsolEventCtrl.ePage.Masters.Done = Done;
            ConsolEventCtrl.ePage.Masters.Config = typeConfig;
            ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails = [];
            ConsolEventCtrl.ePage.Meta.IsLoading = false;

            GetCfxTypeList();

            ConsolEventCtrl.ePage.Masters.DatePicker = {};
            ConsolEventCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            ConsolEventCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConsolEventCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ConsolEventCtrl.ePage.Masters.DatePicker.Closed = Closed;
        }

        function GetCfxTypeList() {
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGREFD"
            };
            apiService.post("eAxisAPI", "OrgRefDate/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails = response.data.Response;
                    ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventtypes = $filter('unique')(ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails,'ReferenceKey')
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ConsolEventCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Closed(closed) {}

        function setSelectedRow(index,x) {
            angular.forEach(ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails,function(value,key){
                if(value.PK == x.PK){
                    ConsolEventCtrl.ePage.Masters.selectedRow = key;
                }
            })
            ConsolEventCtrl.ePage.Masters.LinesselectedRow = index;
        }

        function Back() {
            var item = ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails[ConsolEventCtrl.ePage.Masters.selectedRow];
            if (item.PK == "") {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Please save your changes. Otherwise given details will be discarded.'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails.splice(ConsolEventCtrl.ePage.Masters.selectedRow, 1);
                        ConsolEventCtrl.ePage.Masters.Lineslist = true;
                        ConsolEventCtrl.ePage.Masters.selectedRow = ConsolEventCtrl.ePage.Masters.selectedRow - 1;
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                ConsolEventCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Done() {
            SaveList(ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails[ConsolEventCtrl.ePage.Masters.selectedRow]);
            ConsolEventCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            ConsolEventCtrl.ePage.Masters.selectedRow = index;
            ConsolEventCtrl.ePage.Masters.Lineslist = false;
            ConsolEventCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (ConsolEventCtrl.ePage.Masters.selectedRow != -1) {
                if (ConsolEventCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ConsolEventCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ConsolEventCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ConsolEventCtrl.ePage.Masters.selectedRow == ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails.length - 1) {
                            return;
                        }
                        ConsolEventCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails[ConsolEventCtrl.ePage.Masters.selectedRow]);
            var obj = {
                "AvailableFrom":item.AvailableFrom,
                "AvailableTo":item.AvailableTo,
                "CreatedBy":"",
                "CreatedDateTime":"",
                "EndDate":item.EndDate,
                "IsDeleted":false,
                "IsModified":false,
                "ModifiedBy":"",
                "ModifiedDateTime":null,
                "ORG_FK":"",
                "PK":"",
                "ReferanceDateType":"",
                "ReferenceKey":item.ReferenceKey,
                "ReferenceValue":item.ReferenceValue,
                "StartDate":item.StartDate
            };

            ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails.splice(ConsolEventCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ConsolEventCtrl.ePage.Masters.Edit(ConsolEventCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails[ConsolEventCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", 'OrgRefDate/Delete/' + item.PK ).then(function (response) {
                        toastr.success('Record Removed Successfully');
                        GetCfxTypeList()
                    });
                    ConsolEventCtrl.ePage.Masters.selectedRow = ConsolEventCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "AvailableFrom":"",
                "AvailableTo":"",
                "CreatedBy":"",
                "CreatedDateTime":"",
                "EndDate":"",
                "IsDeleted":false,
                "IsModified":false,
                "ModifiedBy":"",
                "ModifiedDateTime":null,
                "ORG_FK":"",
                "PK":"",
                "ReferanceDateType":"",
                "ReferenceKey":"",
                "ReferenceValue":"",
                "StartDate":""
            };

            ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails.push(obj);
            ConsolEventCtrl.ePage.Masters.Edit(ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails.length - 1, 'New List');
        };

        function SaveList($item) {
            if ($item.ReferenceKey && $item.ReferenceValue && $item.AvailableFrom && $item.AvailableTo && $item.StartDate && $item.EndDate) {
                if ($item.PK) {
                    $item.IsModified = true;
                    ConsolEventCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ConsolEventCtrl.ePage.Entities.Header.API.UpdateOrgRefDate.Url, $item).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails[ConsolEventCtrl.ePage.Masters.selectedRow] = response.data.Response;
                            toastr.success("Saved Successfully")
                        }
                    });
                } else {
                    ConsolEventCtrl.ePage.Masters.IsLoadingToSave = true;
                    apiService.post("eAxisAPI", ConsolEventCtrl.ePage.Entities.Header.API.InsertOrgRefDate.Url, [$item]).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ConsolEventCtrl.ePage.Entities.Header.Data.ConsolEventDetails[ConsolEventCtrl.ePage.Masters.selectedRow] = response.data.Response[0];
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
