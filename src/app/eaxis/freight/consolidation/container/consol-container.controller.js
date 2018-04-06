(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerConController", ContainerConController);

    ContainerConController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "consolidationConfig", "helperService", "$filter", "toastr", "confirmation", "$uibModal"];

    function ContainerConController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, consolidationConfig, helperService, $filter, toastr, confirmation, $uibModal) {
        /* jshint validthis: true */
        var ContainerConCtrl = this;

        function Init() {
            var currentConsol = ContainerConCtrl.currentConsol[ContainerConCtrl.currentConsol.label].ePage.Entities;
            ContainerConCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol,
            };

            ContainerConCtrl.ePage.Masters.Container = {};
            ContainerConCtrl.ePage.Masters.Container.FormView = {};

            //DatePicker
            ContainerConCtrl.ePage.Masters.DatePicker = {};
            ContainerConCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ContainerConCtrl.ePage.Masters.DatePicker.isOpen = [];
            ContainerConCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;



            // Grid Configuration Input
            ContainerConCtrl.ePage.Masters.Container.gridConfig = ContainerConCtrl.ePage.Entities.Container.Grid.GridConfig;

            ContainerConCtrl.ePage.Masters.Container.gridConfig.columnDef = ContainerConCtrl.ePage.Entities.Container.Grid.ColumnDef;


            ContainerConCtrl.ePage.Masters.Container.AddNewContainer = AddNewContainer;
            ContainerConCtrl.ePage.Masters.Container.SelectedGridRow = SelectedGridRow;
            ContainerConCtrl.ePage.Masters.Container.DeleteContainer = DeleteContainer;
            ContainerConCtrl.ePage.Masters.Container.DeleteConfirmation = DeleteConfirmation;
            ContainerConCtrl.ePage.Masters.Container.AddToGrid = AddToGrid;

            ContainerConCtrl.ePage.Masters.DropDownMasterList = consolidationConfig.Entities.Header.Meta;


            if (!ContainerConCtrl.currentConsol.isNew) {
                getContainerList();
            } else {
                ContainerConCtrl.ePage.Masters.Container.GridData = [];
            }


        }

        function getContainerList() {

            var _filter = [{
                "FieldName": "CON_FK",
                "value": ContainerConCtrl.ePage.Entities.Header.Data.PK
            }];

            var _input = {
                "searchInput": _filter,
                "FilterID": ContainerConCtrl.ePage.Entities.Container.API.FindAll.FilterID
            };

            // API Call
            apiService.post("eAxisAPI", ContainerConCtrl.ePage.Entities.Container.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ContainerConCtrl.ePage.Entities.Header.Data.UICntContainers = response.data.Response;
                } else {
                    console.log("Container list Empty");
                }
                GetContainerDetails()
            });

        }

        function GetContainerDetails() {
            var _gridData = [];
            ContainerConCtrl.ePage.Masters.Container.GridData = undefined;
            $timeout(function () {
                if (ContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.length > 0) {
                    ContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("Container List is Empty");
                }

                ContainerConCtrl.ePage.Masters.Container.GridData = _gridData;
                ContainerConCtrl.ePage.Masters.Container.FormView = {};
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ContainerConCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function AddNewContainer() {
            ContainerConCtrl.ePage.Masters.Container.FormView = {};
            PopUpModal('new', ContainerConCtrl.ePage.Masters.Container.FormView)
        }

        function PopUpModal(type, data, index) {
            // body...
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "Concontainer right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/freight/consolidation/container/container-modal/container-modal.html",
                controller: 'containerPopUpModalController',
                controllerAs: "ContainerPopUpModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Mode": type,
                            "index": index,
                            "Cnt_Data": data,
                            "currentConsol": ContainerConCtrl.currentConsol
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.index != undefined) {
                        ContainerConCtrl.ePage.Entities.Header.Data.UICntContainers[response.index] = response.data;
                    } else {
                        ContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.push(response.data);
                        toastr.success("Record Added Successfully...!");
                    }
                    GetContainerDetails();

                },
                function () {
                    console.log("Cancelled");
                }

            );
        }

        function SelectedGridRow($item) {
            if ($item.action == 'edit') {
                PopUpModal('edit', $item.data, $item.index)
            } else {
                DeleteConfirmation($item);
            }

        }

        function DeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteContainer($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteContainer($item) {

            if ($item.index !== -1) {

                apiService.post("eAxisAPI", ContainerConCtrl.ePage.Entities.Container.API.Delete.Url+$item.data.PK).then(function (response) {
                    if (response.data.Response) {
                        ContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.splice($item.index, 1);
                        GetContainerDetails();
                        toastr.success("Record Deleted Successfully...!");
                    }
                });
            }
        }

        function AddToGrid() {
            var _isEmpty = angular.equals({}, ContainerConCtrl.ePage.Masters.Container.FormView);

            if (!_isEmpty) {
                ContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.push(ContainerConCtrl.ePage.Masters.Container.FormView);

                GetContainerDetails();
                toastr.success("Record Added Successfully...!");
            } else {
                toastr.success("Cannot Insert Empty Data...!");
            }
        }

        // function GetMastersDropDownList() {
        //     // Get CFXType Dropdown list
        //     var typeCodeList = ["WEIGHTUNIT", "VOLUMEUNIT", "CNT_DELIVERYMODE"];
        //     var dynamicFindAllInput = [];

        //     typeCodeList.map(function (value, key) {
        //         dynamicFindAllInput[key] = {
        //             "FieldName": "TypeCode",
        //             "value": value
        //         }
        //     });
        //     var _input = {
        //         "searchInput": dynamicFindAllInput,
        //         "FilterID": consolidationConfig.Entities.Container.API.DynamicFindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", consolidationConfig.Entities.Container.API.DynamicFindAll.Url, _input).then(function (response) {
        //         typeCodeList.map(function (value, key) {
        //             ContainerConCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
        //             ContainerConCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
        //         });
        //         // for (var x in GeneralConCtrl.ePage.Entities.Header.Meta) {
        //         //     GeneralConCtrl.ePage.Masters.DropDownMasterList[x] = GeneralConCtrl.ePage.Entities.Header.Meta[x];
        //         // }

        //     });
        // }




        Init();
    }
})();
