(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneContainerConController", ThreeOneContainerConController);

    ThreeOneContainerConController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "three_consolidationConfig", "helperService", "toastr", "confirmation", "$uibModal"];

    function ThreeOneContainerConController($scope, $timeout, APP_CONSTANT, apiService, three_consolidationConfig, helperService, toastr, confirmation, $uibModal) {
        /* jshint validthis: true */
        var ThreeOneContainerConCtrl = this;

        function Init() {
            var currentConsol = ThreeOneContainerConCtrl.currentConsol[ThreeOneContainerConCtrl.currentConsol.label].ePage.Entities;
            ThreeOneContainerConCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol,
            };

            ThreeOneContainerConCtrl.ePage.Masters.Container = {};
            ThreeOneContainerConCtrl.ePage.Masters.Container.FormView = {};

            //DatePicker
            ThreeOneContainerConCtrl.ePage.Masters.DatePicker = {};
            ThreeOneContainerConCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ThreeOneContainerConCtrl.ePage.Masters.DatePicker.isOpen = [];
            ThreeOneContainerConCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ThreeOneContainerConCtrl.ePage.Masters.Container.AddNewContainer = AddNewContainer;
            ThreeOneContainerConCtrl.ePage.Masters.Container.SelectedGridRow = SelectedGridRow;
            ThreeOneContainerConCtrl.ePage.Masters.Container.DeleteContainer = DeleteContainer;
            ThreeOneContainerConCtrl.ePage.Masters.Container.DeleteConfirmation = DeleteConfirmation;
            ThreeOneContainerConCtrl.ePage.Masters.Container.AddToGrid = AddToGrid;

            ThreeOneContainerConCtrl.ePage.Masters.DropDownMasterList = three_consolidationConfig.Entities.Header.Meta;

            if (!ThreeOneContainerConCtrl.currentConsol.isNew) {
                getContainerList();
            } else {
                ThreeOneContainerConCtrl.ePage.Masters.Container.GridData = [];
            }
        }

        function getContainerList() {
            var _filter = [{
                "FieldName": "CON_FK",
                "value": ThreeOneContainerConCtrl.ePage.Entities.Header.Data.PK
            }];

            var _input = {
                "searchInput": _filter,
                "FilterID": ThreeOneContainerConCtrl.ePage.Entities.Container.API.FindAll.FilterID
            };

            // API Call
            apiService.post("eAxisAPI", ThreeOneContainerConCtrl.ePage.Entities.Container.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ThreeOneContainerConCtrl.ePage.Entities.Header.Data.UICntContainers = response.data.Response;
                } else {
                    console.log("Container list Empty");
                }
                GetContainerDetails()
            });

        }

        function GetContainerDetails() {
            var _gridData = [];
            ThreeOneContainerConCtrl.ePage.Masters.Container.GridData = undefined;
            $timeout(function () {
                if (ThreeOneContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.length > 0) {
                    ThreeOneContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("Container List is Empty");
                }

                ThreeOneContainerConCtrl.ePage.Masters.Container.GridData = _gridData;
                ThreeOneContainerConCtrl.ePage.Masters.Container.FormView = {};
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ThreeOneContainerConCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function AddNewContainer() {
            ThreeOneContainerConCtrl.ePage.Masters.Container.FormView = {};
            PopUpModal('new', ThreeOneContainerConCtrl.ePage.Masters.Container.FormView)
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
                templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_container/3_1_container-modal/three-one-container-modal.html",
                controller: 'ThreeOneContainerPopUpModalController',
                controllerAs: "ThreeOneContainerPopUpModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Mode": type,
                            "index": index,
                            "Cnt_Data": data,
                            "currentConsol": ThreeOneContainerConCtrl.currentConsol
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.index != undefined) {
                        ThreeOneContainerConCtrl.ePage.Entities.Header.Data.UICntContainers[response.index] = response.data;
                    } else {
                        ThreeOneContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.push(response.data);
                        toastr.success("Record Added Successfully...!");
                    }
                    GetContainerDetails();
                },
                function () {
                    console.log("Cancelled");
                }

            );
        }

        function SelectedGridRow(item, type, index) {
            if (type == 'edit') {
                PopUpModal('edit', item, index)
            } else {
                DeleteConfirmation(item, index);
            }
        }

        function DeleteConfirmation(item, index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteContainer(item, index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteContainer(item, index) {
            if (index !== -1) {
                apiService.post("eAxisAPI", ThreeOneContainerConCtrl.ePage.Entities.Container.API.Delete.Url + item.PK).then(function (response) {
                    if (response.data.Response) {
                        ThreeOneContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.splice(index, 1);
                        GetContainerDetails();
                        toastr.success("Record Deleted Successfully...!");
                    }
                });
            }
        }

        function AddToGrid() {
            var _isEmpty = angular.equals({}, ThreeOneContainerConCtrl.ePage.Masters.Container.FormView);

            if (!_isEmpty) {
                ThreeOneContainerConCtrl.ePage.Entities.Header.Data.UICntContainers.push(ThreeOneContainerConCtrl.ePage.Masters.Container.FormView);

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
        //         "FilterID": three_consolidationConfig.Entities.Container.API.DynamicFindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", three_consolidationConfig.Entities.Container.API.DynamicFindAll.Url, _input).then(function (response) {
        //         typeCodeList.map(function (value, key) {
        //             ThreeOneContainerConCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
        //             ThreeOneContainerConCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
        //         });
        //         // for (var x in GeneralConCtrl.ePage.Entities.Header.Meta) {
        //         //     GeneralConCtrl.ePage.Masters.DropDownMasterList[x] = GeneralConCtrl.ePage.Entities.Header.Meta[x];
        //         // }

        //     });
        // }

        Init();
    }
})();