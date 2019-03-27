(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceJobMenuController", FinanceJobMenuController);

    FinanceJobMenuController.$inject = ["helperService", "financeConfig", "apiService", "toastr"];

    function FinanceJobMenuController(helperService, financeConfig, apiService, toastr) {
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
            FinanceJobMenuCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
            FinanceJobMenuCtrl.ePage.Masters.PostRevenueButtonText = "Post Revenue";
            FinanceJobMenuCtrl.ePage.Masters.PostButtonText = "Post";
            FinanceJobMenuCtrl.ePage.Masters.DisableSave = false;
            FinanceJobMenuCtrl.ePage.Masters.Config = financeConfig;

            /* Function */
            FinanceJobMenuCtrl.ePage.Masters.Validation = Validation;
            FinanceJobMenuCtrl.ePage.Masters.Save = Save;
            FinanceJobMenuCtrl.ePage.Masters.PostCost = PostCost;
            FinanceJobMenuCtrl.ePage.Masters.PostRevenue = PostRevenue;
        }

        //#region Validation
        function Validation($item, type) {
            console.log("validation", $item, type);
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

        //#region Save
        function Save($item) {
            FinanceJobMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            FinanceJobMenuCtrl.ePage.Masters.DisableSave = true;
            // FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            _input.UIJobHeader.IsActive = true;

            if ($item.isNew) {
                _input.PK = _input.UIJobHeader.PK;
                _input.UIJobHeader.CreatedDateTime = new Date();
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
                // FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;

                if (response.Status === "success") {
                    apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.GetById.Url + response.Data.PK).then(function (response) {
                        if (response.data.Status == "Success") {

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
                                // helperService.refreshGrid();
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
                if ($item.isNew) {
                    _input.PK = _input.UIJobHeader.PK;
                    _input.UIJobHeader.CreatedDateTime = new Date();
                } else {
                    $item = filterObjectUpdate($item, "IsModified");
                    if ($item[$item.code].ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                        $item[$item.code].ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                            (value.PK) ? value.IsModified = true : value.IsModified = false;
                        });
                    }
                }

                helperService.SaveEntity($item, 'JobHeader').then(function (response) {
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;;
                    FinanceJobMenuCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;

                    if (response.Status === "success") {
                        apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.GetById.Url + FinanceJobMenuCtrl.currentFinanceJob.code).then(function (response) {
                            if (response.data.Status == "Success") {

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
                                    //helperService.refreshGrid();
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
                toastr.error("Job charges already posted...!");
            }
            else if (_PostRevenue1 && _PostedRevenue == 0) {
                FinanceJobMenuCtrl.ePage.Masters.PostRevenueButtonText = "Please Wait...";
                if ($item.isNew) {
                    _input.PK = _input.UIJobHeader.PK;
                    _input.UIJobHeader.CreatedDateTime = new Date();
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
                    FinanceJobMenuCtrl.ePage.Masters.PostRevenueButtonText = "Post Revenue";
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;

                    if (response.Status === "success") {
                        apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.GetById.Url + FinanceJobMenuCtrl.currentFinanceJob.code).then(function (response) {
                            if (response.data.Status == "Success") {

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
                                    // helperService.refreshGrid();
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
                if ($item.isNew) {
                    _input.PK = _input.UIJobHeader.PK;
                    _input.UIJobHeader.CreatedDateTime = new Date();
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
                    FinanceJobMenuCtrl.ePage.Masters.PostButtonText = "Post";
                    FinanceJobMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;

                    if (response.Status === "success") {
                        apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.GetById.Url + response.Data.PK).then(function (response) {
                            if (response.data.Status == "Success") {

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
                                    // helperService.refreshGrid();
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
        //#endregion

        Init();
    }

})();