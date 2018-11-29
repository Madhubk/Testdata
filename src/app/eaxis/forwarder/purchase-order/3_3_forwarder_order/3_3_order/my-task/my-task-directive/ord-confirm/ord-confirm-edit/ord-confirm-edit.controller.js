(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdConfirmEditDirectiveController", OrdConfirmEditDirectiveController);

    OrdConfirmEditDirectiveController.$inject = ["$scope", "$timeout", "apiService", "appConfig", "toastr", "errorWarningService", "helperService", "authService"];

    function OrdConfirmEditDirectiveController($scope, $timeout, apiService, appConfig, toastr, errorWarningService, helperService, authService) {
        var OrdConfirmEditDirectiveCtrl = this;

        function Init() {
            OrdConfirmEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Confrimation_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            OrderConfrimationInit();
        }

        function OrderConfrimationInit() {
            OrdConfirmEditDirectiveCtrl.ePage.Masters.TaskObj = OrdConfirmEditDirectiveCtrl.taskObj;
            OrdConfirmEditDirectiveCtrl.ePage.Masters.DataChanges = DataChanges;
            OrdConfirmEditDirectiveCtrl.ePage.Masters.OrderConfirmation = OrderConfirmation;
            OrdConfirmEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            OrdConfirmEditDirectiveCtrl.ePage.Masters.AttachOrder = AttachOrder;
            OrdConfirmEditDirectiveCtrl.ePage.Masters.IsUpdateDisabled = false;
            OrdConfirmEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update Order Confirmation";
            OrdConfirmEditDirectiveCtrl.ePage.Masters.GridLoad = false;
            OrdConfirmEditDirectiveCtrl.ePage.Masters.OpenOrders = [];

            GetOrderList();
            initValidation();
            OpenOrdersList();

            $scope.$watch('OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader', function (newValue, oldValue) {
                if (OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader) {
                    if (OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.length > 0) {
                        for (i = 0; i < OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.length; i++) {
                            OrdConfirmEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                                if (value.PK == OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[i].PK) {
                                    value.ConfirmNo = OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[i].ConfirmNo;
                                    value.ConfirmDate = OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader[i].ConfirmDate;
                                }
                            });
                        }
                    }
                }
            }, true);
        }

        function GetOrderList() {
            var _inputObj = {
                "PK": OrdConfirmEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 25,
            };
            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (val, key) {
                            val.status = true;
                        });
                        OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader = response.data.Response;
                        OrdConfirmEditDirectiveCtrl.ePage.Masters.SelectedOrder = angular.copy(response.data.Response);
                        OrdConfirmEditDirectiveCtrl.ePage.Masters.GridLoad = true;
                    }
                }
            });
        }

        function initValidation() {
            if (OrdConfirmEditDirectiveCtrl.ePage.Masters.TaskObj) {
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [OrdConfirmEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
                    API: "Validation", // Validation/Group
                    FilterInput: {
                        ModuleCode: "ORD",
                        SubModuleCode: "CNR"
                    },
                    // GroupCode: "PRE_ADV",
                    //     RelatedBasicDetails: [{
                    //         "UIField": "TEST",
                    //         "DbField": "TEST",
                    //         "Value": "TEST"
                    //     }],
                    ErrorCode: [],
                    EntityObject: OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data
                };

                errorWarningService.GetErrorCodeList(_obj);
                // error warning modal
                OrdConfirmEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                OrdConfirmEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[OrdConfirmEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
                OrdConfirmEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[OrdConfirmEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            }
            // error warning modal
            OrdConfirmEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
        }

        function OpenOrdersList() {
            var _input = {
                "SortColumn": "WKI_CreatedDateTime",
                "PageNumber": 1,
                "PageSize": 25,
                // "C_Performer": authService.getUserInfo().UserId,
                "TenantCode": authService.getUserInfo().TenantCode,
                "PSM_FK": "ea8b40b0-787f-4237-8d93-5d21ef976de6",
                "Status": "AVAILABLE,ASSIGNED"
            };
            var _filterInput = {
                "searchInput": helperService.createToArrayOfObject(_input),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _filterInput).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        if (value.EntityRefKey == OrdConfirmEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                            response.data.Response.splice(key, 1);
                        }
                    });
                    var _orderPks = CommaSeperatedField(response.data.Response, 'EntityRefKey');
                    OrderFindAll(_orderPks);
                }
            });
        }

        function OrderFindAll(_PKs) {
            var _input = {
                "SortColumn": "POH_CreatedDateTime",
                "PageNumber": 1,
                "PageSize": 25,
                "POH_PKS": _PKs
            };
            var _filterInput = {
                "searchInput": helperService.createToArrayOfObject(_input),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _filterInput).then(function (response) {
                if (response.data.Response) {
                    OrdConfirmEditDirectiveCtrl.ePage.Masters.OpenOrders = response.data.Response;
                } else {}
            });
        }

        function AttachOrder(obj, index) {
            OrdConfirmEditDirectiveCtrl.ePage.Masters.OpenOrders.map(function (val, key) {
                if (val.PK == obj.PK && index == key) {
                    OrdConfirmEditDirectiveCtrl.ePage.Masters.OpenOrders.splice(key, 1);
                    val.status = true;
                    OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.push(val);
                    OrdConfirmEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(val);
                }
            });
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                OrdConfirmEditDirectiveCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                OrdConfirmEditDirectiveCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.PK == _item.item.PK) {
                        OrdConfirmEditDirectiveCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function OrderConfirmation($item) {
            OrdConfirmEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Please wait...";
            OrdConfirmEditDirectiveCtrl.ePage.Masters.IsUpdateDisabled = true;
            if (OrdConfirmEditDirectiveCtrl.ePage.Masters.SelectedOrder.length > 0) {
                CommonErrorObjInput();
            } else {
                toastr.warning("please select atleast one order(s)");
            }
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[OrdConfirmEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    // UpdateRecords($item);
                } else {
                    ShowErrorWarningModal(OrdConfirmEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo);
                    OrdConfirmEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update Order Confirmation";
                    OrdConfirmEditDirectiveCtrl.ePage.Masters.IsUpdateDisabled = false;
                }
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function CommonErrorObjInput(errorCode, $index) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [OrdConfirmEditDirectiveCtrl.taskObj.PSI_InstanceNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "CNR",
                },
                // GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: OrdConfirmEditDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? [errorCode] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function UpdateRecords(_items) {
            var _updateInput = [];
            for (i = 0; i < _items.length; i++) {
                var _tempObj = {
                    "EntityRefPK": _items[i].PK,
                    "Properties": [{
                            "PropertyName": "POH_ConfirmNo",
                            "PropertyNewValue": _items[i].ConfirmNo
                        },
                        {
                            "PropertyName": "POH_ConfirmDate",
                            "PropertyNewValue": _items[i].ConfirmDate
                        }
                    ]
                };
                _updateInput.push(_tempObj);
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Successfully saved...");
                    var _data = {
                        IsCompleted: true,
                        Item: OrdConfirmEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    OrdConfirmEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Save Failed...");
                    OrdConfirmEditDirectiveCtrl.ePage.Masters.UpdateBtn = "Update Order Confirmation";
                    OrdConfirmEditDirectiveCtrl.ePage.Masters.IsUpdateDisabled = false;
                }
            });
        }

        function CommaSeperatedField(item, fieldName) {
            var field = "";
            item.map(function (val, key) {
                field += val[fieldName] + ','
            });
            return field.substring(0, field.length - 1);
        }

        Init();
    }
})();