(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickSlipController", PickSlipController);

    PickSlipController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$document", "$filter", "pickConfig"];

    function PickSlipController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $document, $filter, pickConfig) {

        var PickSlipCtrl = this;

        function Init() {

            //To find whether the response for inward or outward

            if (PickSlipCtrl.currentPick != undefined) {
                var currentPickSlip = PickSlipCtrl.currentPick[PickSlipCtrl.currentPick.label].ePage.Entities;
            }
            else {
                var currentPickSlip = PickSlipCtrl.currentRelease[PickSlipCtrl.currentRelease.label].ePage.Entities;
            }

            PickSlipCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick_Slip",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickSlip,
            };

            PickSlipCtrl.ePage.Masters.Config = pickConfig;

            PickSlipCtrl.ePage.Masters.emptyText = "-";
            PickSlipCtrl.ePage.Masters.IsLoading = false;

            PickSlipCtrl.ePage.Masters.selectedRow = 0;
            PickSlipCtrl.ePage.Masters.TempSelectedRow = 0;

            PickSlipCtrl.ePage.Masters.getProductDetails = getProductDetails;
            PickSlipCtrl.ePage.Masters.ToAllocateStock = ToAllocateStock;
            PickSlipCtrl.ePage.Masters.ToAllocateQty = ToAllocateQty;
            PickSlipCtrl.ePage.Masters.ToAllocateQtyCheckbox = ToAllocateQtyCheckbox;

            PickSlipCtrl.ePage.Masters.AllocateStockText = "Allocate Stock";

            // Order By
            PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'CreatedDateTime');

            if (PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatusDesc == "Finalized") {
                PickSlipCtrl.ePage.Entities.Header.CheckPoints.DisableAllocate = true;
                PickSlipCtrl.ePage.Masters.IsDisableAllocateStock = true;
            } else {
                PickSlipCtrl.ePage.Entities.Header.CheckPoints.DisableAllocate = false;
                PickSlipCtrl.ePage.Masters.IsDisableAllocateStock = false;
            }
            getPickOrderLineList();
        }

        // To allocate stock through allocate
        function ToAllocateQty(item, index) {
            if (item.OldAllocatedQty == undefined) {
                item.OldAllocatedQty = 0;
            }
            if (item.AvailableToPick == 0) {
                if (item.IsAllocate == true) {
                    item.IsAllocate = false;
                    toastr.warning("You cannot add this stock. Please choose another stock.");
                }
                else {
                    angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value, key) {
                        if (value.WOL_InventoryLine_FK == item.PK && value.WOL_TransactionLine == PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PK) {
                            item.AllocatedQty = 0;
                            value.TempPickLineUnits = angular.copy(value.Units);
                            value.Units = 0;
                            value.IsDeleted = true;
                        }
                    });
                }
            }
            else if (item.AvailableToPick > 0) {
                var filter = $filter("filter")(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value, key) {
                    if (value.WOL_InventoryLine_FK == item.PK && value.WOL_TransactionLine == PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PK) {
                        if (item.IsAllocate == true) {
                            item.AllocatedQty = value.Units;
                            value.IsDeleted = false;
                            value.IsModified = true;

                            if (item.AvailableToPick > PickSlipCtrl.ePage.Masters.SelectedOutwardLine.Units) {
                                item.AllocatedQty = PickSlipCtrl.ePage.Masters.SelectedOutwardLine.Units;
                            } else if (item.AvailableToPick < PickSlipCtrl.ePage.Masters.SelectedOutwardLine.Units) {
                                item.AllocatedQty = item.AvailableToPick;
                            } else {
                                item.AllocatedQty = item.AvailableToPick;
                            }
                            value.Units = item.AllocatedQty;
                        }
                        else if (item.IsAllocate == false) {
                            item.AllocatedQty = 0;
                            value.TempPickLineUnits = angular.copy(value.Units);
                            value.Units = 0;
                            value.IsDeleted = true;
                            if(value.PK == undefined){
                                PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.splice(key, 1);
                            }
                        }
                        return value;
                    }
                });

                if (filter.length == 0) {
                    if (item.IsAllocate == true) {
                        if (item.AvailableToPick > PickSlipCtrl.ePage.Masters.SelectedOutwardLine.Units) {
                            item.AllocatedQty = PickSlipCtrl.ePage.Masters.SelectedOutwardLine.Units;
                        } else if (item.AvailableToPick < PickSlipCtrl.ePage.Masters.SelectedOutwardLine.Units) {
                            item.AllocatedQty = item.AvailableToPick;
                        } else {
                            item.AllocatedQty = item.AvailableToPick;
                        }

                        var obj = {
                            "WOL_InventoryLine_FK": item.PK,
                            "WOL_TransactionLine": PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PK,
                            "Units": item.AllocatedQty,
                            "IsDeleted": item.IsDeleted,
                            "IsModified": true
                        }
                        PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.push(obj);
                    }
                    else if (item.IsAllocate == false) {
                        angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value, key) {
                            if (value.WOL_InventoryLine_FK == item.PK) {
                                item.AllocatedQty = 0;
                                PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.splice(key, 1);
                            }
                        });
                    }
                }
            }

            PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PickedQty = 0;

            var filter2 = $filter("filter")(PickSlipCtrl.ePage.Masters.PickInventoryList, function (value2, key2) {
                if (value2.IsAllocate == true) {
                    PickSlipCtrl.ePage.Masters.PickInventoryList = moveElementInArray(PickSlipCtrl.ePage.Masters.PickInventoryList, value2, -key2);
                    angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value1, key1) {
                        if (value2.PK == value1.WOL_InventoryLine_FK) {
                            // angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, function (value, key) {
                            if (PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PK == value1.WOL_TransactionLine) {
                                if (value1.Units != 0) {
                                    PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PickedQty = PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PickedQty + value1.Units;
                                } else {
                                    PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PickedQty = PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PickedQty + value1.TempPickLineUnits;
                                }
                            }
                            // });
                        }
                    });
                }
                return value2;
            });
            if (filter2.length > 0) {
                checkPickedOty(PickSlipCtrl.ePage.Masters.SelectedOutwardLine);
            }

            item.CommitedUnit = item.CommitedUnit - item.OldAllocatedQty + item.AllocatedQty;
            item.AvailableToPick = item.TotalUnits - (item.CommitedUnit + item.ReservedUnit + item.InTransitUnit);
            item.OldAllocatedQty = item.AllocatedQty;

        }

        function moveElementInArray(array, value, positionChange) {
            var oldIndex = array.indexOf(value);
            if (oldIndex > -1) {
                var newIndex = (oldIndex + positionChange);

                if (newIndex < 0) {
                    newIndex = 0
                } else if (newIndex >= array.length) {
                    newIndex = array.length
                }

                var arrayClone = array.slice();
                arrayClone.splice(oldIndex, 1);
                arrayClone.splice(newIndex, 0, value);

                return arrayClone
            }
            return array
        }

        // to allocate stock through AllocatedQty
        function ToAllocateQtyCheckbox(item, index) {
            if (item.AllocatedQty == "" || item.AllocatedQty == undefined) {
                item.AllocatedQty = 0;
            }
            item.AllocatedQty = parseInt(item.AllocatedQty);
            item.OldCommitedUnit = item.CommitedUnit;
            item.oldAvailableToPick = item.AvailableToPick;

            if (item.OldAllocatedQty == undefined) {
                item.OldAllocatedQty = 0;
            }

            item.CommitedUnit = item.CommitedUnit - item.OldAllocatedQty + item.AllocatedQty;
            item.AvailableToPick = item.TotalUnits - (item.CommitedUnit + item.ReservedUnit + item.InTransitUnit);

            item.AvailableToPickInCurrentTransaction = item.AllocatedQty + item.AvailableToPick;
            var Temp = item.CommitedUnit ? (item.AvailableToPickInCurrentTransaction < item.AllocatedQty) : (item.AvailableToPick <= 0);

            if (Temp) {
                if (item.AvailableToPick < 0) {
                    item.CommitedUnit = item.OldCommitedUnit;
                    item.AvailableToPick = item.oldAvailableToPick;
                    item.AllocatedQty = item.OldAllocatedQty;
                    toastr.warning("AllocatedQty cannot be greater than available To Pick.");
                } else if (item.AllocatedQty > item.AvailableToPickInCurrentTransaction) {
                    item.AllocatedQty = item.AvailableToPickInCurrentTransaction;
                    toastr.warning("AllocatedQty cannot be greater than available To Pick.");
                } else if (item.AvailableToPick == 0) {
                    item.IsAllocate = false;
                    item.AllocatedQty = 0;
                    toastr.warning("You cannot add this stock. Please choose another stock.");
                }
            }
            else {
                if (item.AllocatedQty > 0) {
                    var filter = $filter("filter")(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value, key) {
                        if (value.WOL_InventoryLine_FK == item.PK && value.WOL_TransactionLine == PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PK) {
                            if (item.AllocatedQty >= 1) {
                                item.IsAllocate = true;
                                value.IsDeleted = false;
                                value.IsModified = true;
                                value.Units = item.AllocatedQty;
                            }
                            return value;
                        }
                    });

                    if (filter.length == 0) {
                        if (item.AllocatedQty >= 1) {
                            item.IsAllocate = true;

                            var filter1 = $filter("filter")(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value, key) {
                                if (value.WOL_InventoryLine_FK == item.PK && value.WOL_TransactionLine == PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PK) {
                                    value.Units = item.AllocatedQty;
                                    value.IsModified = true;
                                    return value;
                                }
                            });
                            if (filter1.length == 0) {
                                var obj = {
                                    "WOL_InventoryLine_FK": item.PK,
                                    "WOL_TransactionLine": PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PK,
                                    "Units": item.AllocatedQty,
                                    "IsDeleted": item.IsDeleted,
                                    "IsModified": true
                                }
                                PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.push(obj);
                                PickSlipCtrl.ePage.Masters.PickInventoryList = moveElementInArray(PickSlipCtrl.ePage.Masters.PickInventoryList, item, -index);
                            }
                        }
                    }
                }
                else if (item.AllocatedQty == 0) {
                    angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value, key) {
                        if (value.WOL_InventoryLine_FK == item.PK && value.WOL_TransactionLine == PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PK) {
                            item.IsAllocate = false;
                            value.IsDeleted = true;
                            if(value.PK == undefined){
                                PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.splice(key, 1);
                            }
                        }
                    });
                    PickSlipCtrl.ePage.Masters.PickInventoryList = moveElementInArray(PickSlipCtrl.ePage.Masters.PickInventoryList, item, index);
                }
                PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PickedQty = 0;
                var filter3 = $filter("filter")(PickSlipCtrl.ePage.Masters.PickInventoryList, function (value2, key2) {
                    if (value2.IsAllocate == true) {
                        angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value1, key1) {
                            if (value2.PK == value1.WOL_InventoryLine_FK) {
                                // angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, function (value, key) {
                                if (PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PK == value1.WOL_TransactionLine) {
                                    PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PickedQty = PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PickedQty + value1.Units;
                                }
                                // });
                            }
                        });
                    }
                    return value2;
                });
                if (filter3.length > 0) {
                    checkPickedOty(PickSlipCtrl.ePage.Masters.SelectedOutwardLine);
                }
                item.OldAllocatedQty = item.AllocatedQty;
            }
        }

        function checkPickedOty(value) {
            if (value.PickedQty > value.Units) {
                angular.forEach(PickSlipCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                    if (value.Code.trim() === "E8009") {
                        PickSlipCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", true, value.CtrlKey.trim(), PickSlipCtrl.currentPick.label, false, undefined, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                    }
                });
            } else {
                angular.forEach(PickSlipCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                    if (value.Code.trim() === "E8009") {
                        PickSlipCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), PickSlipCtrl.currentPick.label, false, undefined, value.ColIndex);
                    }
                });
            }
        }
        // get pick order line list
        function getPickOrderLineList() {
            PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines;
            PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine = PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine;
        }

        // To get Product details
        function getProductDetails(item, index, event, selectedLine) {

            PickSlipCtrl.ePage.Masters.TempSelectedRow = 1;
            PickSlipCtrl.ePage.Masters.selectedRow = index;
            if (selectedLine.PRO_FK != null && PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus != 'PIF') {
                if (event != undefined) {
                    if (event.type = "click") {
                        PickSlipCtrl.ePage.Masters.IsLoading = true;
                        Validation(PickSlipCtrl.currentPick).then(function (response) {
                            PickSlipCtrl.ePage.Entities.Header.Data = response.Data;
                            PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'CreatedDateTime');
                            getInventoryDetails(item, index, event, selectedLine);
                            angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, function (value, key) {
                                value.PickedQty = 0;
                                if (PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.length > 0) {
                                    angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value1, key1) {
                                        if (value.PK == value1.WOL_TransactionLine) {
                                            value.PickedQty = value.PickedQty + value1.Units;
                                        }
                                    });
                                }
                            });
                        });
                    }
                } else {
                    getInventoryDetails(item, index, event, selectedLine);
                    angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, function (value, key) {
                        value.PickedQty = 0;
                        if (PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.length > 0) {
                            angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value1, key1) {
                                if (value.PK == value1.WOL_TransactionLine) {
                                    value.PickedQty = value.PickedQty + value1.Units;
                                }
                            });
                        }
                    });
                }
            } else if (PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus == 'PIF') {
                getInventoryDetails(item, index, event, selectedLine);
                angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, function (value, key) {
                    value.PickedQty = 0;
                    if (PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.length > 0) {
                        angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value1, key1) {
                            if (value.PK == value1.WOL_TransactionLine) {
                                value.PickedQty = value.PickedQty + value1.Units;
                            }
                        });
                    }
                });
            }
        }

        function getInventoryDetails(item, index, event, selectedLine) {
            PickSlipCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "PRO_FK": selectedLine.PRO_FK,
                "ORG_FK": selectedLine.Client_FK,
                "WAR_FK": selectedLine.WAR_FK,
                "PartAttrib1": selectedLine.PartAttrib1,
                "PartAttrib2": selectedLine.PartAttrib2,
                "PartAttrib3": selectedLine.PartAttrib3,
                "PackingDate": selectedLine.PackingDate,
                "ExpiryDate": selectedLine.ExpiryDate,
                "SortColumn": "WOL_CreatedDateTime",
                "OriginalInventoryStatus": 'AVL',
                "SortType": "ASC"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": PickSlipCtrl.ePage.Entities.Header.API.Inventory.FilterID
            };
            apiService.post("eAxisAPI", PickSlipCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    PickSlipCtrl.ePage.Masters.PickInventoryList = response.data.Response;
                    PickSlipCtrl.ePage.Masters.IsLoading = false;
                    if (PickSlipCtrl.ePage.Masters.PickInventoryList.length == 0) {
                        PickSlipCtrl.ePage.Masters.IsDisableAllocateStock = true;
                    } else {
                        PickSlipCtrl.ePage.Masters.IsDisableAllocateStock = false;
                    }

                    PickSlipCtrl.ePage.Entities.Header.CheckPoints.DisableAllocate = false;

                    PickSlipCtrl.ePage.Masters.SelectedOutwardLine = selectedLine;
                    PickSlipCtrl.ePage.Masters.SelectedOutwardLine.PickedQty = 0;
                    if (PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatusDesc == "Finalized") {
                        PickSlipCtrl.ePage.Entities.Header.CheckPoints.DisableAllocate = true;
                    }
                    //  else {
                    if (selectedLine.WorkOrderLineStatusDesc == "Finalized") {
                        PickSlipCtrl.ePage.Entities.Header.CheckPoints.DisableAllocate = true;
                        PickSlipCtrl.ePage.Masters.IsDisableAllocateStock = true;
                    }
                    angular.forEach(PickSlipCtrl.ePage.Masters.PickInventoryList, function (value, key) {
                        if (PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine.length > 0) {
                            angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value1, key1) {
                                if (value.PK == value1.WOL_InventoryLine_FK && selectedLine.PK == value1.WOL_TransactionLine) {

                                    var filter = $filter("filter")(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLineSummary, function (value2, key2) {
                                        if (value2.InventoryLine_FK == value1.WOL_InventoryLine_FK && value2.TransactionLine == value1.WOL_TransactionLine) {
                                            return value2;
                                        }
                                    });
                                    if (filter.length > 0) {
                                        value.AllocatedQty = 0;
                                        // selectedLine.PickedQty = 0;
                                        angular.forEach(filter, function (value3, key3) {
                                            value.AllocatedQty = value.AllocatedQty + value3.Units;
                                            if (value3.PickedDateTime) {
                                                PickSlipCtrl.ePage.Entities.Header.CheckPoints.DisableAllocate = true;
                                            }
                                        });
                                    }
                                    if (selectedLine.PK == value1.WOL_TransactionLine) {
                                        selectedLine.PickedQty = selectedLine.PickedQty + value1.Units;
                                    }
                                    // selectedLine.PickedQty = selectedLine.PickedQty + value.AllocatedQty;
                                    value.OldAllocatedQty = value.AllocatedQty;
                                    if (value1.Units != 0) {
                                        value.IsAllocate = true;
                                    }
                                    if (value.IsAllocate == true) {
                                        PickSlipCtrl.ePage.Masters.PickInventoryList = moveElementInArray(PickSlipCtrl.ePage.Masters.PickInventoryList, value, -key);
                                    }
                                    PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines[index].PickedQty = selectedLine.PickedQty;
                                    PickSlipCtrl.ePage.Masters.IsLoading = false;
                                    checkPickedOty(selectedLine);
                                } else {
                                    PickSlipCtrl.ePage.Masters.IsLoading = false;
                                }
                            });
                        } else {
                            PickSlipCtrl.ePage.Masters.IsLoading = false;
                        }
                    });
                    // }
                } else {
                    PickSlipCtrl.ePage.Masters.PickInventoryList = [];
                    PickSlipCtrl.ePage.Masters.IsLoading = false;
                    PickSlipCtrl.ePage.Masters.IsDisableAllocateStock = true;
                }
            });
        }
        // function for allocate stock
        function ToAllocateStock() {
            PickSlipCtrl.ePage.Masters.AllocateStockText = "Allocating...";
            PickSlipCtrl.ePage.Masters.IsDisableAllocateStock = true;
            var count = 0;
            angular.forEach(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickLine, function (value, key) {
                if (value.IsModified == true || value.IsDeleted == true) {
                    count = count + 1;
                }
            });
            if (count > 0) {
                Validation(PickSlipCtrl.currentPick).then(function (response) {
                    PickSlipCtrl.ePage.Entities.Header.Data = response.Data;
                    apiService.post("eAxisAPI", PickSlipCtrl.ePage.Entities.Header.API.AllocateStock.Url, PickSlipCtrl.ePage.Entities.Header.Data).then(function (response) {
                        if (response.data.Status == "Success") {
                            if (response.data.Response) {
                                PickSlipCtrl.ePage.Entities.Header.Data = response.data.Response;
                                PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'CreatedDateTime');
                                toastr.success("Stock allocated successfully");
                                getProductDetails(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 0, undefined, PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines[0]);
                                PickSlipCtrl.ePage.Masters.AllocateStockText = "Allocate Stock";
                                PickSlipCtrl.ePage.Masters.IsDisableAllocateStock = false;
                            }
                        } else {
                            toastr.error("Stock allocation failed");
                        }
                    });
                });
            } else {
                apiService.post("eAxisAPI", PickSlipCtrl.ePage.Entities.Header.API.AllocateStock.Url, PickSlipCtrl.ePage.Entities.Header.Data).then(function (response) {
                    if (response.data.Status == "Success") {
                        if (response.data.Response) {
                            PickSlipCtrl.ePage.Entities.Header.Data = response.data.Response;
                            PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'CreatedDateTime');
                            toastr.success("Stock allocated successfully");
                            getProductDetails(PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 0, undefined, PickSlipCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines[0]);
                            PickSlipCtrl.ePage.Masters.AllocateStockText = "Allocate Stock";
                            PickSlipCtrl.ePage.Masters.IsDisableAllocateStock = false;
                        }
                    } else {
                        toastr.error("Stock allocation failed");
                    }
                });
            }
        }
        // Save
        function Validation($item) {
            var deferred = $q.defer();
            // PickSlipCtrl.ePage.Masters.NonEdit = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            PickSlipCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (PickSlipCtrl.ePage.Entities.Header.Validations) {
                PickSlipCtrl.ePage.Masters.Config.RemoveApiErrors(PickSlipCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                // Save($item);
                PickSlipCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
                $item = filterObjectUpdate($item, "IsModified");

                _input.UIWmsOutward.map(function (value, key) {
                    value.WPK_FK = _input.UIWmsPickHeader.PK;
                })
                _input.UIWmsOutwardLines.map(function (value, key) {
                    value.WPK_FK = _input.UIWmsPickHeader.PK;
                })

                helperService.SaveEntity($item, 'Pick').then(function (response) {
                    PickSlipCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;

                    if (response.Status === "success") {

                        var _index = pickConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(PickSlipCtrl.currentPick[PickSlipCtrl.currentPick.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            if ($state.current.url == "/pick") {
                                helperService.refreshGrid();
                            }
                            if (response.Data.Response) {
                                pickConfig.TabList[_index][pickConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                            }
                            else {
                                pickConfig.TabList[_index][pickConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            }
                            PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.FinalisedDate = 'null';
                            PickSlipCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNumber = 'null';
                            // PickSlipCtrl.ePage.Masters.NonEdit = false;
                        }
                        pickConfig.TabList[_index].isNew = false;

                        console.log("Success");
                    } else if (response.Status === "failed") {
                        console.log("Failed");
                        PickSlipCtrl.ePage.Masters.IsLoading = false;
                        PickSlipCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            PickSlipCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), PickSlipCtrl.currentPick.label, false, undefined, undefined, undefined, undefined, undefined);
                        });
                        // PickSlipCtrl.ePage.Masters.NonEdit = false;
                        if (PickSlipCtrl.ePage.Entities.Header.Validations != null) {
                            PickSlipCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickSlipCtrl.currentPick);
                        }
                    }
                    deferred.resolve(response);
                });
            } else {
                PickSlipCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickSlipCtrl.currentPick);
                PickSlipCtrl.ePage.Masters.IsLoading = false;
            }
            return deferred.promise;
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