(function () {
    "use strict";

    angular
        .module("Application")
        .controller("preAdviceDirectiveController", PreAdviceDirectiveController);

    PreAdviceDirectiveController.$inject = ["$scope", "$state", "APP_CONSTANT", "apiService", "helperService", "preAdviceConfig", "toastr", "$uibModal", "appConfig", "$window"];

    function PreAdviceDirectiveController($scope, $state, APP_CONSTANT, apiService, helperService, preAdviceConfig, toastr, $uibModal, appConfig, $window) {
        var PreAdviceDirectiveCtrl = this;

        function Init() {
            var currentPreAdvice = PreAdviceDirectiveCtrl.currentPreAdvice[PreAdviceDirectiveCtrl.currentPreAdvice.label].ePage.Entities;
            PreAdviceDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Pre_Advice_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPreAdvice
            };
            // DatePicker
            PreAdviceDirectiveCtrl.ePage.Masters.DatePicker = {};
            PreAdviceDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PreAdviceDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            PreAdviceDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitPreAdvice();
        }

        function InitPreAdvice() {
            PreAdviceDirectiveCtrl.ePage.Masters.TabList = preAdviceConfig.TabList;
            // dynamic grid load function
            PreAdviceDirectiveCtrl.ePage.Masters.ShipmentOrderGridRefreshFun = OrderGridRefreshFun;
            PreAdviceDirectiveCtrl.ePage.Masters.OrderAttach = OrderAttach;
            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList = [];
            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList = PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPorPreAdviceShipment;

            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                value.status = true;
            });

            if (PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.length > 0) {
                PreAdviceDirectiveCtrl.ePage.Masters.SelectAll = "Yes";
            } else {
                PreAdviceDirectiveCtrl.ePage.Masters.SelectAll = "No";
            }
            CopyPreAdviceList();
            PreAdvice();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            PreAdviceDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function CopyPreAdviceList() {
            PreAdviceDirectiveCtrl.ePage.Masters.EditOrderList = [];
            PreAdviceDirectiveCtrl.ePage.Masters.EditOrderList = angular.copy(PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList);
        }

        function PreAdvice() {
            PreAdviceDirectiveCtrl.ePage.Masters.SaveButtonText = "Convert As Booking";
            PreAdviceDirectiveCtrl.ePage.Masters.IsDisableSave = false;
            PreAdviceDirectiveCtrl.ePage.Masters.SavePreAdvice = SavePreAdvice;
            PreAdviceDirectiveCtrl.ePage.Masters.isDataChanged = isDataChanged;
            PreAdviceDirectiveCtrl.ePage.Masters.SelectedOrders = SelectedOrders;
            PreAdviceDirectiveCtrl.ePage.Masters.DetachOrders = DetachOrders;
            PreAdviceDirectiveCtrl.ePage.Masters.Cancel = Cancel;
            PreAdviceDirectiveCtrl.ePage.Masters.SendBookingPreAdvice = SendBookingPreAdvice;
            PreAdviceDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            PreAdviceDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            PreAdviceDirectiveCtrl.ePage.Masters.SelectedData = InsertCall;
            PreAdviceDirectiveCtrl.ePage.Masters.Update = [];
            PreAdviceDirectiveCtrl.ePage.Masters.DetachOrders = DetachOrders;
            PreAdviceDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            PreAdviceDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            // ------- page single-record-view ----------------
            if ($state.current.url == "/pre-advice/:preadviceId" && PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPorPreAdviceShipment.length === 0) {
                apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.GetById.Url + PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader.PK).then(function (response) {
                    if (response.data.Response) {
                        PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.push(response.data.Response.UIPorOrderHeader);
                        InsertCall(PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList);
                    }
                });
            }
        }

        function OrderGridRefreshFun($item) {}

        function OrderAttach() {
            PreAdviceDirectiveCtrl.ePage.Masters.OrderAttachFilter = {
                "Buyer": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader.Buyer,
                "Supplier": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader.Supplier,
                "IsPreAdviceIdCreated": "false",
                "IsShpCreated": "false"
            };
        }

        function InsertCall($item) {
            var _index = PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                return value.SPH_FK;
            }).indexOf(PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader.PK);

            if (_index === -1) {
                if ($item.length > 0) {
                    var _insertInput = [];
                    for (i = 0; i < $item.length; i++) {
                        var _insertList = {
                            "CargoCutOffDate": null,
                            "BookingCutOffDate": null,
                            "InstanceNo": 0,
                            "InstanceStatus": "",
                            "TransportMode": $item[i].TransportMode,
                            "ContainerMode": $item[i].ContainerMode,
                            "IncoTerm": $item[i].IncoTerm,
                            "OrderDate": $item[i].OrderDate,
                            "OrderCumSplitNo": $item[i].OrderCumSplitNo,
                            "PlannedCarrier": "",
                            "PlannedETA": null,
                            "PlannedETD": null,
                            "PlannedVessel": "",
                            "PlannedVoyage": "",
                            "PortOfDischarge": "",
                            "PortOfLoading": "",
                            "IsDeleted": false,
                            "IsPreAdviceIdCreated": false,
                            "IsModified": false,
                            "IsShpCreated": false,
                            "IsValid": false,
                            "PK": "",
                            "POH_FK": $item[i].PK,
                            "SourceRefKey": $item[i].PK,
                            "SPH_FK": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader.PK,
                            "PreAdviceId": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader.PreAdviceId,
                            "OrderNo": $item[i].OrderNo,
                            "IsModified": $item[i].IsModified
                        }
                        _insertInput.push(_insertList)
                    }

                    var _input = {
                        "UIPreAdviceHeader": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader,
                        "UIPorPreAdviceShipment": _insertInput
                    };

                    apiService.post("eAxisAPI", appConfig.Entities.PreAdviceList.API.Insert.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            toastr.success("Successfully Saved....")
                            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList = response.data.Response.UIPorPreAdviceShipment;
                            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                                value.status = true;
                                value.IsPreAdviceIdCreated = true;
                            })
                            // refreshgrid
                            if ($state.current.url != "/pre-advice/:preadviceId") {
                                helperService.refreshGrid()
                            }
                            SelectAllCall(PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList);
                        }
                    });
                }
            } else {
                if ($item.length > 0) {
                    var _updateInput = [];
                    for (i = 0; i < $item.length; i++) {
                        var _updateList = {
                            "CargoCutOffDate": null,
                            "BookingCutOffDate": null,
                            "InstanceNo": 0,
                            "InstanceStatus": "",
                            "TransportMode": $item[i].TransportMode,
                            "ContainerMode": $item[i].ContainerMode,
                            "IncoTerm": $item[i].IncoTerm,
                            "OrderDate": $item[i].OrderDate,
                            "OrderCumSplitNo": $item[i].OrderCumSplitNo,
                            "PlannedCarrier": "",
                            "PlannedETA": null,
                            "PlannedETD": null,
                            "PlannedVessel": "",
                            "PlannedVoyage": "",
                            "PortOfDischarge": "",
                            "PortOfLoading": "",
                            "IsDeleted": false,
                            "IsPreAdviceIdCreated": false,
                            "IsModified": false,
                            "IsShpCreated": false,
                            "IsValid": false,
                            "PK": "",
                            "POH_FK": $item[i].PK,
                            "SourceRefKey": $item[i].PK,
                            "SPH_FK": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader.PK,
                            "PreAdviceId": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader.PreAdviceId,
                            "OrderNo": $item[i].OrderNo,
                            "IsModified": $item[i].IsModified
                        }
                        _updateInput.push(_updateList)
                    }
                    _updateInput.map(function (value, key) {
                        if (!_.find(PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList, {
                                PK: value.POH_FK
                            })) {
                            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.push(value);
                        }
                    });
                    var _input = {
                        "UIPreAdviceHeader": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader,
                        "UIPorPreAdviceShipment": PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.PreAdviceList.API.Update.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            toastr.success("Successfully Saved....")
                            if (response.data.Response.UIPorPreAdviceShipment.length > 0) {
                                PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList = response.data.Response.UIPorPreAdviceShipment;
                            }
                            if (PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.length > 0) {
                                PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                                    value.status = true;
                                    value.IsFollowUpIdCreated = true;
                                });
                            }
                            // refreshgrid
                            if ($state.current.url != "/pre-advice/:preadviceId") {
                                helperService.refreshGrid()
                            }
                            SelectAllCall(PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList)
                        }
                    });
                }
            }
        }

        function SelectAllCall(data) {
            PreAdviceDirectiveCtrl.ePage.Masters.SelectionFalse = undefined;
            if (data.length > 0) {
                data.map(function (value, key) {
                    if (value.status) {} else {
                        PreAdviceDirectiveCtrl.ePage.Masters.SelectionFalse = "Yes";
                    }
                })
            }
            if (PreAdviceDirectiveCtrl.ePage.Masters.SelectionFalse != "Yes") {
                PreAdviceDirectiveCtrl.ePage.Masters.SelectAll = "Yes";
            }
        }

        function SavePreAdvice($item) {
            PreAdviceDirectiveCtrl.ePage.Masters.SaveButtonText = "plaes wait...";
            PreAdviceDirectiveCtrl.ePage.Masters.IsDisableSave = false;
            var _index = PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                return value.SPH_FK;
            }).indexOf(PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader.PK);

            if (_index === -1) {

            } else {
                $item.map(function (value, key) {
                    if (value.status) {
                        value = filterObjectUpdate(value, "IsModified");
                    }
                })
                var _input = {
                    "UIPreAdviceHeader": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader,
                    "UIPorPreAdviceShipment": $item
                };

                apiService.post("eAxisAPI", appConfig.Entities.PreAdviceList.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        toastr.success("Successfully Saved....")
                        PreAdviceDirectiveCtrl.ePage.Masters.SaveButtonText = "Convert As Booking";
                        PreAdviceDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                        if (response.data.Response.UIPorPreAdviceShipment.length > 0) {
                            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList = response.data.Response.UIPorPreAdviceShipment;
                        }
                        if (PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.length > 0) {
                            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                                value.status = true;
                            });
                        }
                        // refreshgrid
                        if ($state.current.url != "/pre-advice/:preadviceId") {
                            appConfig.Entities.refreshGrid()
                        }
                        SelectAllCall(PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList);
                    }
                });
            }
        }

        function SendBookingPreAdvice($item) {}

        function AutoCompleteOnSelect($item, type, data) {
            if (data.status) {
                // Carrier changed
                if (type === 'plannedCarrier') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PlannedCarrier = $item.ORG_CarrierCode;
                        }
                    })
                }
                // vessel changed
                if (type === 'plannedVessel') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PlannedVessel = $item.Code;
                        }
                    })
                }
                // POL changed
                if (type === 'portOfLoading') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PortOfLoading = $item.Code;
                        }
                    })
                }
                // POD changed
                if (type === 'portOfDischarge') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PortOfDischarge = $item.Code;
                        }
                    })
                }
            }

        }

        function SelectedLookupData($item, type, data) {
            if (data.status) {
                // Carrier changed
                if (type === 'plannedCarrier') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PlannedCarrier = $item.entity.ORG_CarrierCode;
                        }
                    })
                }
                // vessel changed
                if (type === 'plannedVessel') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PlannedVessel = $item.entity.Code;
                        }
                    })
                }
                // POL changed
                if (type === 'portOfLoading') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PortOfLoading = $item.entity.Code;
                        }
                    })
                }
                // POD changed
                if (type === 'portOfDischarge') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PortOfDischarge = $item.entity.Code;
                        }
                    })
                }
            }
        }

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.POH_FK,
                OrderNo: obj.OrderNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/order/" + _queryString, "_blank");
        }

        function Checkbox(obj) {
            PreAdviceDirectiveCtrl.ePage.Masters.SelectAll = "No";
            if (obj.status) {
                PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                    if (value.POH_FK == obj.POH_FK) {
                        value.status = true;
                    }
                })
            } else {
                PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                    if (value.POH_FK == obj.POH_FK) {
                        value.status = false;
                    }
                })
            }
            PreAdviceDirectiveCtrl.ePage.Masters.SelectionFalse = "No";
            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                if (value.status) {

                } else {
                    PreAdviceDirectiveCtrl.ePage.Masters.SelectionFalse = "Yes";
                }
            })

            if (PreAdviceDirectiveCtrl.ePage.Masters.SelectionFalse != "Yes") {
                PreAdviceDirectiveCtrl.ePage.Masters.SelectAll = "Yes";
            }
        }

        function Cancel() {
            var _CancelList = [];
            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                if (value.status) {
                    _CancelList.push(value);
                }
            })

            _CancelList.map(function (val, key) {
                if (val.IsPreAdviceIdCreated) {
                    if (val.IsModified) {
                        PreAdviceDirectiveCtrl.ePage.Masters.Modified = true;
                    }
                }
                if (!val.IsPreAdviceIdCreated) {
                    PreAdviceDirectiveCtrl.ePage.Masters.Modified = true;
                }
            });
            if (PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.length > 0 && PreAdviceDirectiveCtrl.ePage.Masters.Modified) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "cancel-modal",
                    scope: $scope,
                    // size : "sm",
                    templateUrl: "app/eAxis/purchase-order/pre-advice/pre-advice-cancel-modal/pre-advice-cancel-modal.html",
                    controller: 'cancelModalController',
                    controllerAs: "CancelModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                "CancelList": _CancelList
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {
                        SavePreAdvice(response).then(function (response) {
                            var currentPreAdvice = PreAdviceDirectiveCtrl.currentPreAdvice[PreAdviceDirectiveCtrl.currentPreAdvice.label].ePage.Entities;
                            if ($state.current.url != "/pre-advice/:preadviceId") {
                                PreAdviceDirectiveCtrl.ePage.Masters.TabList.map(function (value, key) {
                                    if (value.label == currentPreAdvice.Header.Data.UIPreAdviceHeader.PreAdviceId) {
                                        PreAdviceDirectiveCtrl.ePage.Masters.TabList.splice(value, 1);
                                    }
                                });
                            } else {
                                $window.close();
                            }
                        })
                    },
                    function (response) {
                        var currentPreAdvice = PreAdviceDirectiveCtrl.currentPreAdvice[PreAdviceDirectiveCtrl.currentPreAdvice.label].ePage.Entities;
                        if ($state.current.url != "/pre-advice/:preadviceId") {
                            PreAdviceDirectiveCtrl.ePage.Masters.TabList.map(function (value, key) {
                                if (value.label == currentPreAdvice.Header.Data.UIPreAdviceHeader.PreAdviceId) {
                                    PreAdviceDirectiveCtrl.ePage.Masters.TabList.splice(value, 1);
                                }
                            });
                        } else {
                            $window.close();
                        }
                    }
                );
            } else {
                var currentPreAdvice = PreAdviceDirectiveCtrl.currentPreAdvice[PreAdviceDirectiveCtrl.currentPreAdvice.label].ePage.Entities;
                if ($state.current.url != "/pre-advice/:preadviceId") {
                    PreAdviceDirectiveCtrl.ePage.Masters.TabList.map(function (value, key) {
                        if (value.label == currentPreAdvice.Header.Data.UIPreAdviceHeader.PreAdviceId) {
                            PreAdviceDirectiveCtrl.ePage.Masters.TabList.splice(value, 1);
                        }
                    });
                } else {
                    $window.close();
                }
            }
        }

        function DetachOrders() {
            var _DetachList = [];
            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                if (value.status) {
                    _DetachList.push(value);
                }
            })

            if (_DetachList.length > 0) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "detach-modal",
                    scope: $scope,
                    // size : "sm",
                    templateUrl: "app/eAxis/purchase-order/preadvice/detach-modal/preadvice-detach-modal.html",
                    controller: 'detachModalController',
                    controllerAs: "DetachModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                "DetachList": _DetachList,
                                "UIPreAdviceHeader": PreAdviceDirectiveCtrl.ePage.Entities.Header.Data.UIPreAdviceHeader,
                                "State": $state
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {
                        for (i = 0; i < response.length; i++) {
                            PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                                if (value.POH_FK == response[i].POH_FK) {
                                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.splice(key, 1);
                                }
                            })
                        }
                        if ($state.current.url != "/pre-advice/:preadviceId") {
                            helperService.refreshGrid();
                        }
                        CopyPreAdviceList();
                    },
                    function () {
                        console.log("Cancelled");
                    }
                );
            } else {
                toastr.warning("Please select one or more order(s) to detach from follow up")
            }
        }

        function SelectedOrders(selectAll) {
            if (selectAll == "Yes") {
                PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                    value.status = true;
                });
            } else {
                PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                    value.status = false;
                });
            }

        }

        function isDataChanged(obj, type) {
            if (obj.status) {
                // bookingcutoffdate
                if (type === 'bookingCutOffDate') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.BookingCutOffDate = obj.BookingCutOffDate;
                        }
                    })
                }
                // cargocutoffdate
                if (type === 'cargoCutOffDate') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.CargoCutOffDate = obj.CargoCutOffDate;
                        }
                    })
                }
                // voyage
                if (type === 'plannedVoyage') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PlannedVoyage = obj.PlannedVoyage;
                        }
                    })
                }
                // ETD
                if (type === 'ETD') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PlannedETD = obj.PlannedETD;
                        }
                    })
                }
                // ETA
                if (type === 'ETA') {
                    PreAdviceDirectiveCtrl.ePage.Masters.PreAdviceList.map(function (value, key) {
                        if (value.status) {
                            value.PlannedETA = obj.PlannedETA;
                        }
                    })
                }
            }
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        Init();
    }
})();