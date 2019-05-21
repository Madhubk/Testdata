(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceJobMenuController", FinanceJobMenuController);

    FinanceJobMenuController.$inject = ["$uibModal", "$filter", "$scope", "helperService", "APP_CONSTANT", "financeConfig", "apiService", "toastr", "confirmation"];

    function FinanceJobMenuController($uibModal, $filter, $scope, helperService, APP_CONSTANT, financeConfig, apiService, toastr, confirmation) {
        var FinanceJobMenuCtrl = this;

        function Init() {

            var currentFinanceJob = FinanceJobMenuCtrl.currentFinanceJob[FinanceJobMenuCtrl.currentFinanceJob.code].ePage.Entities;

            FinanceJobMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_Job_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentFinanceJob
            };

            FinanceJobMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            FinanceJobMenuCtrl.ePage.Masters.BookCostButtonText = "Book Cost";
            FinanceJobMenuCtrl.ePage.Masters.BookCostDisabled = "Book Cost";
            FinanceJobMenuCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
            FinanceJobMenuCtrl.ePage.Masters.PostRevenueButtonText = "Post Revenue";
            FinanceJobMenuCtrl.ePage.Masters.PostButtonText = "Post";
            FinanceJobMenuCtrl.ePage.Masters.DisableSave = false;
            FinanceJobMenuCtrl.ePage.Masters.Config = financeConfig;

            /* Function */
            FinanceJobMenuCtrl.ePage.Masters.Validation = Validation;
            FinanceJobMenuCtrl.ePage.Masters.BookCost = BookCost;
            FinanceJobMenuCtrl.ePage.Masters.BookCostClose = BookCostClose;
            FinanceJobMenuCtrl.ePage.Masters.BookCostApply = BookCostApply;

            /* DatePicker */
            FinanceJobMenuCtrl.ePage.Masters.DatePicker = {};
            FinanceJobMenuCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            FinanceJobMenuCtrl.ePage.Masters.DatePicker.isOpen = [];
            FinanceJobMenuCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            if (FinanceJobMenuCtrl.ePage.Entities.Header.Data.UIJobHeader.JobClosedDate) {
                FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                FinanceJobMenuCtrl.ePage.Masters.DisableSave = true;
            }
        }

        //#region DatePicker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            FinanceJobMenuCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region Validation
        function Validation($item, type) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            /* Validation Call */
            FinanceJobMenuCtrl.ePage.Masters.Config.GeneralValidation($item, type);
            if (FinanceJobMenuCtrl.ePage.Entities.Header.Validations) {
                FinanceJobMenuCtrl.ePage.Masters.Config.RemoveApiErrors(FinanceJobMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                if (type == 'Save') {
                    Save($item);
                }
                else if (type == 'PostCost') {
                    PostCost($item);
                }
                else if (type == "PostRevenue") {
                    PostRevenue($item);
                }
                else if (type == "Post") {
                    Post($item);
                }
            } else {
                FinanceJobMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(FinanceJobMenuCtrl.currentFinanceJob);
            }
        }
        //#endregion

        //#region BookCost
        function BookCost($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _Creditor, _Currency;

            FinanceJobMenuCtrl.ePage.Masters.SelectedBookCost = $filter('filter')(_input.UIJobCharge, { SingleSelect: true });
            FinanceJobMenuCtrl.ePage.Masters.SelectedBookCostPost = $filter('filter')(FinanceJobMenuCtrl.ePage.Masters.SelectedBookCost, { Costpost: true });
            FinanceJobMenuCtrl.ePage.Masters.SelectedBookCostREV = $filter('filter')(FinanceJobMenuCtrl.ePage.Masters.SelectedBookCost, { ChargeType: "REV" });

            if (FinanceJobMenuCtrl.ePage.Masters.SelectedBookCost.length == 1) {
                toastr.error("Please select minimum 2 records.");
            }
            else if (FinanceJobMenuCtrl.ePage.Masters.SelectedBookCostPost.length > 0) {
                toastr.error("You can not select the posted record.");
            }
            else if (FinanceJobMenuCtrl.ePage.Masters.SelectedBookCostREV.length > 0) {
                toastr.error("You can not select the REV type record.");
            }
            else {
                _Creditor = FinanceJobMenuCtrl.ePage.Masters.SelectedBookCost[0].VendorCode;
                _Currency = FinanceJobMenuCtrl.ePage.Masters.SelectedBookCost[0].RX_NKCostCurrency;

                var _isExist = FinanceJobMenuCtrl.ePage.Masters.SelectedBookCost.some(function (value, key) {
                    if (value.VendorCode != _Creditor || value.RX_NKCostCurrency != _Currency) {
                        return true;
                    } else {
                        return false;
                    }
                });

                if (_isExist) {
                    toastr.error("Please check the currency either creditor.");
                } else {
                    FinanceJobMenuCtrl.ePage.Masters.modalInstance = $uibModal.open({
                        animation: true,
                        keyboard: false,
                        backdrop: "static",
                        windowClass: "success-popup",
                        scope: $scope,
                        size: "sm",
                        templateUrl: "app/eaxis/finance/finance-job/finance-job-menu/finance-job-BookCost.html",
                    });
                }
            }
        }

        function BookCostClose() {
            FinanceJobMenuCtrl.ePage.Masters.modalInstance.dismiss('close');
        }

        function BookCostApply($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if (!FinanceJobMenuCtrl.ePage.Masters.InvoiceNo || !FinanceJobMenuCtrl.ePage.Masters.InvoiceDate) {
                toastr.error("Please fill the InvoiceNo, InvoiceDate.");
            } else {
                _input.UIJobCharge.map(function (value, key) {
                    if (value.SingleSelect) {
                        value.APInvoiceNum = FinanceJobMenuCtrl.ePage.Masters.InvoiceNo;
                        value.APInvoiceDate = FinanceJobMenuCtrl.ePage.Masters.InvoiceDate;
                    }
                });
                FinanceJobMenuCtrl.ePage.Masters.modalInstance.dismiss('close');
                toastr.success("Successfully update records.");
            }
        }
        //#endregion

        //#region Save
        function Save($item) {
            FinanceJobMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            FinanceJobMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            _input.UIJobHeader.IsActive = true;

            if ($item.isNew) {
                _input.UIJobHeader.PK = _input.PK;
                _input.UIJobHeader.CreatedDateTime = new Date();

                if (!_input.UIJobHeader.EntityRefKey && !_input.UIJobHeader.EntitySource) {
                    if (financeConfig.DataentryName == "FreightJobList") {
                        _input.UIJobHeader.EntityRefKey = _input.UIJobHeader.LocalOrg_FK;
                        _input.UIJobHeader.EntitySource = "SHP";
                    } else if (financeConfig.DataentryName == "WarehouseJobList") {
                        _input.UIJobHeader.EntityRefKey = _input.UIJobHeader.LocalOrg_FK;
                        _input.UIJobHeader.EntitySource = "WMS";
                    } else if (financeConfig.DataentryName == "TransportJobList") {
                        _input.UIJobHeader.EntityRefKey = _input.UIJobHeader.LocalOrg_FK;
                        _input.UIJobHeader.EntitySource = "DMS";
                    }
                }
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                if ($item[$item.code].ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                    $item[$item.code].ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                        (value.PK) ? value.IsModified = true : value.IsModified = false;
                    });
                }
            }

            helperService.SaveEntity($item, 'JobHeader').then(function (response) {
                FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
                FinanceJobMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                FinanceJobMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    apiService.get("eAxisAPI", financeConfig.Entities.API.JobHeaderList.API.GetById.Url + response.Data.UIJobHeader.PK).then(function (response) {
                        if (response.data.Status == "Success") {
                            FinanceJobMenuCtrl.ePage.Entities.Header.Data = response.data.Response;

                            /* financeConfig.InitBinding(FinanceJobMenuCtrl.currentFinanceJob); */

                            var _index = financeConfig.TabList.map(function (value, key) {
                                return value[value.code].ePage.Entities.Header.Data.PK;
                            }).indexOf(FinanceJobMenuCtrl.currentFinanceJob[FinanceJobMenuCtrl.currentFinanceJob.code].ePage.Entities.Header.Data.PK);

                            financeConfig.TabList.map(function (value, key) {
                                if (_index == key) {
                                    if (value.isNew) {
                                        value.label = FinanceJobMenuCtrl.ePage.Entities.Header.Data.UIJobHeader.JobNo;
                                        value[FinanceJobMenuCtrl.ePage.Entities.Header.Data.UIJobHeader.JobNo] = value.isNew;
                                        delete value.isNew;
                                    }
                                }
                            });

                            financeConfig.InitBinding(FinanceJobMenuCtrl.currentFinanceJob);

                            if (_index !== -1) {
                                if (response.data.Response) {
                                    financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                                }
                                else {
                                    financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                                }
                                financeConfig.TabList[_index].isNew = false;
                                helperService.refreshGrid();
                            }

                            if (FinanceJobMenuCtrl.ePage.Entities.Header.Data.UIJobHeader.JobClosedDate) {
                                FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                            }

                            toastr.success("Saved Successfully...!");
                        }
                        else if (response.data.Status === "failed") {
                            console.log("GetById Failed");
                        }
                    });
                } else if (response.Status === "failed") {
                    toastr.error("Could not Save...!");
                    FinanceJobMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        FinanceJobMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, FinanceJobMenuCtrl.currentFinanceJob.code, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (FinanceJobMenuCtrl.ePage.Entities.Header.Validations != null) {
                        FinanceJobMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(FinanceJobMenuCtrl.currentFinanceJob);
                    }
                }
            });
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
        //#endregion

        //#region Post Cost, Post Revenue, Post 
        function PostCost($item) {
            var _PostedCost = 0;
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            var _PostCost1 = _input.UIJobCharge.some(function (value, key) {
                if (value.SingleSelect == true && !value.PK || value.ChargeType == "REV") {
                    return false;
                }
                else {
                    return true;
                }
            });

            if (_PostCost1) {
                _input.UIJobCharge.map(function (value, key) {
                    if (value.SingleSelect == true && value.PK && value.ChargeType != "REV") {
                        if (!value.Costpost) {
                            value.APPostDate = new Date().toUTCString();
                            value.Costpost = false;
                        }
                        else if (value.Costpost) {
                            _PostedCost = _PostedCost + 1;
                        }
                    }
                });
            }

            if (!_PostCost1) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Post Cost?',
                    bodyText: "Please save the job charge (OR) charge type not 'REV'  before posting charges"
                };

                confirmation.showModal({}, modalOptions).then(function (result) {
                    console.log(result);
                    return false;

                }, function () {
                    console.log("Cancelled");
                    return false;
                });
            }
            else if (_PostedCost > 0) {
                toastr.error("Selected Job charges already posted Any One...!");
            }
            else if (_PostCost1 && _PostedCost == 0) {
                FinanceJobMenuCtrl.ePage.Masters.PostCostButtonText = "Please Wait...";

                helperService.SaveEntity($item, 'JobHeader').then(function (response) {
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;;
                    FinanceJobMenuCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;

                    if (response.Status === "success") {
                        apiService.get("eAxisAPI", financeConfig.Entities.API.JobHeaderList.API.GetById.Url + response.Data.UIJobHeader.PK).then(function (response) {
                            if (response.data.Status == "Success") {
                                FinanceJobMenuCtrl.ePage.Entities.Header.Data = response.data.Response;

                                financeConfig.InitBinding(FinanceJobMenuCtrl.currentFinanceJob);

                                var _index = financeConfig.TabList.map(function (value, key) {
                                    return value[value.code].ePage.Entities.Header.Data.PK;
                                }).indexOf(FinanceJobMenuCtrl.currentFinanceJob[FinanceJobMenuCtrl.currentFinanceJob.code].ePage.Entities.Header.Data.PK);

                                if (_index !== -1) {
                                    if (response.data.Response) {
                                        financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                                    }
                                    else {
                                        financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                                    }
                                    financeConfig.TabList[_index].isNew = false;
                                    helperService.refreshGrid();
                                }
                                toastr.success("Post Cost Successfully...!");
                            }
                            else if (response.data.Status === "failed") {
                                console.log("GetById Failed");
                            }
                        });
                    } else if (response.Status === "failed") {
                        toastr.error("Could not Post Cost...!");
                        FinanceJobMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            FinanceJobMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, FinanceJobMenuCtrl.currentFinanceJob.code, false, undefined, undefined, undefined, undefined, undefined);
                        });
                        if (FinanceJobMenuCtrl.ePage.Entities.Header.Validations != null) {
                            FinanceJobMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(FinanceJobMenuCtrl.currentFinanceJob);
                        }
                    }
                });
            }
        }

        function PostRevenue($item) {
            var _PostedRevenue = 0;
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            var _PostRevenue1 = _input.UIJobCharge.some(function (value, key) {
                if (value.SingleSelect == true && !value.PK) {
                    return false;
                }
                else {
                    return true;
                }
            });

            if (_PostRevenue1) {
                _input.UIJobCharge.map(function (value, key) {
                    if (value.SingleSelect == true && value.PK) {
                        if (!value.Revenuepost) {
                            value.ARPostDate = new Date().toUTCString();
                            value.Revenuepost = false;
                        }
                        else if (value.Revenuepost) {
                            _PostedRevenue = _PostedRevenue + 1;
                        }
                    }
                });
            }

            if (!_PostRevenue1) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Post Revenue?',
                    bodyText: "Please save the job charge before posting charges"
                };

                confirmation.showModal({}, modalOptions).then(function (result) {
                    console.log(result);
                    return false;

                }, function () {
                    console.log("Cancelled");
                    return false;
                });
            }
            else if (_PostedRevenue > 0) {
                toastr.error("Selected Job charges already posted Any One...!");
            }
            else if (_PostRevenue1 && _PostedRevenue == 0) {
                FinanceJobMenuCtrl.ePage.Masters.PostRevenueButtonText = "Please Wait...";

                helperService.SaveEntity($item, 'JobHeader').then(function (response) {
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                    FinanceJobMenuCtrl.ePage.Masters.PostRevenueButtonText = "Post Revenue";
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;

                    if (response.Status === "success") {
                        apiService.get("eAxisAPI", financeConfig.Entities.API.JobHeaderList.API.GetById.Url + response.Data.UIJobHeader.PK).then(function (response) {
                            if (response.data.Status == "Success") {
                                FinanceJobMenuCtrl.ePage.Entities.Header.Data = response.data.Response;

                                financeConfig.InitBinding(FinanceJobMenuCtrl.currentFinanceJob);

                                var _index = financeConfig.TabList.map(function (value, key) {
                                    return value[value.code].ePage.Entities.Header.Data.PK;
                                }).indexOf(FinanceJobMenuCtrl.currentFinanceJob[FinanceJobMenuCtrl.currentFinanceJob.code].ePage.Entities.Header.Data.PK);

                                if (_index !== -1) {
                                    if (response.data.Response) {
                                        financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                                    }
                                    else {
                                        financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                                    }
                                    financeConfig.TabList[_index].isNew = false;
                                    helperService.refreshGrid();
                                }
                                toastr.success("Post Revenue Successfully...!");
                            }
                            else if (response.data.Status === "failed") {
                                console.log("GetById Failed");
                            }
                        });
                    } else if (response.Status === "failed") {
                        toastr.error("Could not Post Revenue...!");
                        FinanceJobMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            FinanceJobMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, FinanceJobMenuCtrl.currentFinanceJob.code, false, undefined, undefined, undefined, undefined, undefined);
                        });
                        if (FinanceJobMenuCtrl.ePage.Entities.Header.Validations != null) {
                            FinanceJobMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(FinanceJobMenuCtrl.currentFinanceJob);
                        }
                    }
                });
            }
        }

        function Post($item) {
            var _PostedCost = 0;
            var _PostedRevenue = 0;
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            var _PostCost1 = _input.UIJobCharge.some(function (value, key) {
                if (value.SingleSelect == true && !value.PK || value.ChargeType == "REV") {
                    return false;
                }
                else {
                    return true;
                }
            });

            var _PostRevenue1 = _input.UIJobCharge.some(function (value, key) {
                if (value.SingleSelect == true && !value.PK) {
                    return false;
                }
                else {
                    return true;
                }
            });

            if (_PostCost1) {
                _input.UIJobCharge.map(function (value, key) {
                    if (value.SingleSelect == true && value.PK && value.ChargeType != "REV") {
                        if (!value.Costpost) {
                            value.APPostDate = new Date().toUTCString();
                            value.Costpost = false;
                        }
                        else if (value.Costpost) {
                            _PostedCost = _PostedCost + 1;
                        }
                    }
                });
            }

            if (_PostRevenue1) {
                _input.UIJobCharge.map(function (value, key) {
                    if (value.SingleSelect == true && value.PK) {
                        if (!value.Revenuepost) {
                            value.ARPostDate = new Date().toUTCString();
                            value.Revenuepost = false;
                        }
                        else if (value.Revenuepost) {
                            _PostedRevenue = _PostedRevenue + 1;
                        }
                    }
                });
            }

            if (!_PostCost1 || !_PostRevenue1) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Post Cost?',
                    bodyText: "Please save the job charge (OR) charge type not 'REV'  before posting charges"
                };

                confirmation.showModal({}, modalOptions).then(function (result) {
                    console.log(result);
                    return false;

                }, function () {
                    console.log("Cancelled");
                    return false;
                });
            }
            else if (_PostedCost > 0 || _PostedRevenue > 0) {
                toastr.error("Job charges already posted...!");
            }
            else if (_PostCost1 && _PostedCost == 0 && _PostRevenue1 && _PostedRevenue == 0) {
                FinanceJobMenuCtrl.ePage.Masters.PostButtonText = "Please Wait...";

                helperService.SaveEntity($item, 'JobHeader').then(function (response) {
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                    FinanceJobMenuCtrl.ePage.Masters.PostButtonText = "Post";
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;

                    if (response.Status === "success") {
                        apiService.get("eAxisAPI", financeConfig.Entities.API.JobHeaderList.API.GetById.Url + response.Data.UIJobHeader.PK).then(function (response) {
                            if (response.data.Status == "Success") {
                                FinanceJobMenuCtrl.ePage.Entities.Header.Data = response.data.Response;

                                financeConfig.InitBinding(FinanceJobMenuCtrl.currentFinanceJob);

                                var _index = financeConfig.TabList.map(function (value, key) {
                                    return value[value.code].ePage.Entities.Header.Data.PK;
                                }).indexOf(FinanceJobMenuCtrl.currentFinanceJob[FinanceJobMenuCtrl.currentFinanceJob.code].ePage.Entities.Header.Data.PK);

                                if (_index !== -1) {
                                    if (response.data.Response) {
                                        financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                                    }
                                    else {
                                        financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                                    }
                                    financeConfig.TabList[_index].isNew = false;
                                    helperService.refreshGrid();
                                }
                                toastr.success("Post Cost and Revenue Successfully...!");
                            }
                            else if (response.data.Status === "failed") {
                                console.log("GetById Failed");
                            }
                        });
                    } else if (response.Status === "failed") {
                        toastr.error("Could not Post Cost...!");
                        FinanceJobMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            FinanceJobMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, FinanceJobMenuCtrl.currentFinanceJob.code, false, undefined, undefined, undefined, undefined, undefined);
                        });
                        if (FinanceJobMenuCtrl.ePage.Entities.Header.Validations != null) {
                            FinanceJobMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(FinanceJobMenuCtrl.currentFinanceJob);
                        }
                    }
                });
            }
        }
        //#endregion

        Init();
    }

})();