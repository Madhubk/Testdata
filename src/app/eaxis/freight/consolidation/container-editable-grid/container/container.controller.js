/*
    Page : Container
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerController", ContainerController);

    ContainerController.$inject = ["$scope", "$filter", "$timeout", "helperService", "authService", "apiService", "appConfig", "confirmation", "toastr", "$uibModal"];

    function ContainerController($scope, $filter, $timeout, helperService, authService, apiService, appConfig, confirmation, toastr, $uibModal) {
        var ContainerDirCtrl = this;
        var currentObject;
        (ContainerDirCtrl.currentObject) ? currentObject = ContainerDirCtrl.currentObject[ContainerDirCtrl.currentObject.label].ePage.Entities: currentObject = ContainerDirCtrl.obj[ContainerDirCtrl.obj.label].ePage.Entities;        

        function Init() {
            ContainerDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObject,
                "GlobalVariables": {
                    "Loading": false,
                    "NonEditable": false
                },
            };
            ContainerDirCtrl.ePage.Masters.emptyText = "-";
            ContainerDirCtrl.ePage.Masters.Enable = true;
            ContainerDirCtrl.ePage.Masters.FormView = {};
            ContainerDirCtrl.ePage.Masters.selectedRow = -1;
            ContainerDirCtrl.ePage.Masters.selectedRowObj = {};
            ContainerDirCtrl.ePage.Entities.Header.TableProperties = {};
            ContainerDirCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ContainerDirCtrl.ePage.Masters.Container = {};
            ContainerDirCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ContainerDirCtrl.ePage.Masters.EditRow = EditRow;
            ContainerDirCtrl.ePage.Masters.More = More;
            ContainerDirCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ContainerDirCtrl.ePage.Masters.SelectedConTypeData = SelectedConTypeData;
            // get table properties 
            if (ContainerDirCtrl.tableProperties) {
                $timeout(function () {
                    ContainerDirCtrl.ePage.Entities.Header.TableProperties.UICntContainers = angular.copy(ContainerDirCtrl.tableProperties);
                })

            } else {
                GetGridColumList();
                GetContainerList();
            }
            //Pagination
            ContainerDirCtrl.ePage.Masters.Pagination = {};
            ContainerDirCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            ContainerDirCtrl.ePage.Masters.Pagination.MaxSize = 3;
            ContainerDirCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;

            ContainerDirCtrl.ePage.Masters.DropDownMasterList = {
                "CON_CNTMODE": {
                    "ListSource": []
                },
                "CNT_DELIVERYMODE": {
                    "ListSource": []
                },
                "CNT_STATUS": {
                    "ListSource": []
                }
            }
            GetCfxTypeList();
        }

        function setSelectedRow(data, index) {
            ContainerDirCtrl.ePage.Masters.selectedRow = index;
            ContainerDirCtrl.ePage.Masters.FormView = data;
        }

        function GetGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "EntitySource": "CONTAINER",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value);
                        ContainerDirCtrl.ePage.Entities.Header.TableProperties.UICntContainers = obj;
                    }
                }
            });
        }

        function GetContainerList() {
            var dynamicFindAllInput = {
                [ContainerDirCtrl.apiHeaderFieldName]: currentObject.Header.Data.PK
            }
            var _input = {
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(dynamicFindAllInput)
            };
            apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName] = response.data.Response;
                } else {
                    console.log("Container list Empty");
                }
            });
        }

        function AddNewRow() {
            ContainerDirCtrl.ePage.Masters.Container.FormView = {};
            ContainerDirCtrl.ePage.Masters.Container.FormView.IsDeleted = false;
            ContainerDirCtrl.ePage.Masters.Container.FormView.PK = "";
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].push(ContainerDirCtrl.ePage.Masters.Container.FormView);
            ContainerDirCtrl.ePage.Masters.selectedRow = _.filter(ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName]).length - 1;
            ContainerDirCtrl.ePage.Masters.selectedRowObj = ContainerDirCtrl.ePage.Masters.Container.FormView;
            // Add Scroll
            $timeout(function () {
                var divObj = document.getElementById("ContainerDirCtrl.ePage.Masters.AddScroll");
                divObj.scrollTop = divObj.scrollHeight;
            }, 50);
        }

        function More(index, item) {
            if (item.Pk) {
                ContainerPopUp('edit', index, item)
            }
            if (!item.Pk) {
                ContainerPopUp('new', index, item)
            }
        }

        function ContainerPopUp(action, index, item) {
            // body...
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "Concontainer right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/freight/consolidation/container-editable-grid/container/container-edit/container-grid-modal/container-grid-modal.html",
                controller: 'ContainerModalPopUpController',
                controllerAs: "ContainerModalPopUpCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Mode": action,
                            "index": index,
                            "Cnt_Data": item,
                            "currentObject": ContainerDirCtrl.currentObject
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.index != undefined) {
                        ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName][response.index] = response.data;
                    } else {
                        ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].push(response.data);
                        toastr.success("Record Added Successfully...!");
                    }
                },
                function () {
                    console.log("Cancelled");
                });
        }

        function EditRow($index) {
            if ($index == ContainerDirCtrl.ePage.Masters.selectedRow) {
                var _data = {
                    Item: ContainerDirCtrl.ePage.Masters.FormView,
                    Index: ContainerDirCtrl.ePage.Masters.selectedRow
                }
                ContainerDirCtrl.conEdit({
                    $item: _data
                });
            }
        }

        function RemoveRow(index, item) {
            if (ContainerDirCtrl.ePage.Masters.selectedRowObj) {
                if (ContainerDirCtrl.keyObjectName == "SHP") {
                    if (ContainerDirCtrl.ePage.Masters.selectedRowObj.PK) {
                        ContainerDirCtrl.ePage.Masters.RemoveList = $filter('filter')(ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName], {
                            ContainerCount: ContainerDirCtrl.ePage.Masters.selectedRowObj.ContainerCount
                        });
                        ContainerDirCtrl.ePage.Masters.RemoveList.map(function (value, key) {
                            value.IsDeleted = true
                        });
                        ContainerDirCtrl.ePage.Masters.CountList = $filter('filter')(ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName], {
                            IsDeleted: false
                        });
                    } else {
                        ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].map(function (val, key) {
                            if (val.PK == ContainerDirCtrl.ePage.Masters.selectedRowObj.PK && val.containerCount == ContainerDirCtrl.ePage.Masters.selectedRowObj.containerCount && val.RH_NKContainerCommodityCode == ContainerDirCtrl.ePage.Masters.selectedRowObj.RH_NKContainerCommodityCode && val.ContainerMode == ContainerDirCtrl.ePage.Masters.selectedRowObj.ContainerMode) {
                                ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].splice(key, 1);
                            }
                        });
                    }
                }
                if (ContainerDirCtrl.keyObjectName == "CON") {
                    if (ContainerDirCtrl.ePage.Masters.selectedRowObj.PK) {
                        ContainerDirCtrl.ePage.Masters.RemoveList = $filter('filter')(ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName], {
                            ContainerNo: ContainerDirCtrl.ePage.Masters.selectedRowObj.ContainerNo
                        });
                        ContainerDirCtrl.ePage.Masters.RemoveList.map(function (value, key) {
                            value.IsDeleted = true
                        });
                        ContainerDirCtrl.ePage.Masters.CountList = $filter('filter')(ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName], {
                            IsDeleted: false
                        });
                    } else {
                        ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].map(function (val, key) {
                            if (val.PK == ContainerDirCtrl.ePage.Masters.selectedRowObj.PK && val.ContainerNo == ContainerDirCtrl.ePage.Masters.selectedRowObj.ContainerNo && val.ContainerMode == ContainerDirCtrl.ePage.Masters.selectedRowObj.ContainerMode && val.ContainerStatus == ContainerDirCtrl.ePage.Masters.selectedRowObj.ContainerStatus && val.DeliveryMode == ContainerDirCtrl.ePage.Masters.selectedRowObj.DeliveryMode && val.IsEmptyContainer == ContainerDirCtrl.ePage.Masters.selectedRowObj.IsEmptyContainer) {
                                ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].splice(key, 1);
                            }
                        });
                    }
                }
                ContainerDirCtrl.ePage.Masters.selectedRow = -1;
            }
        }

        function GetCfxTypeList() {
            var typeCodeList = ["CON_CNTMODE", "CNT_DELIVERYMODE", "CNT_STATUS"];
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
                typeCodeList.map(function (value, key) {
                    ContainerDirCtrl.ePage.Masters.DropDownMasterList[value].ListSource = helperService.metaBase();
                    ContainerDirCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                });
            });
        }

        function SelectedConTypeData($item, RC_Type) {
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].CNM_TareWeight = (parseInt($item.CNM_TareWeight)).toFixed(3);
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].CNM_GrossWeight = (parseInt($item.CNM_GrossWeight)).toFixed(3);
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].CNM_Height = (parseInt($item.CNM_Height)).toFixed(3);
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].CNM_Length = (parseInt($item.CNM_Length)).toFixed(3);
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].CNM_Width = (parseInt($item.CNM_Width)).toFixed(3);
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].TotalHeight = (parseInt($item.CNM_Height)).toFixed(3);
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].TotalLength = (parseInt($item.CNM_Length)).toFixed(3);
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].TotalWidth = (parseInt($item.CNM_Width)).toFixed(3);
            ContainerDirCtrl.ePage.Entities.Header.Data[ContainerDirCtrl.apiHeaderValueName].CNM_CubicCapacity = (parseInt($item.CNM_CubicCapacity)).toFixed(3);
        }

        Init();
    }
})();