(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BranchDetailsController", BranchDetailsController);

    BranchDetailsController.$inject = ["$timeout", "appConfig", "branchConfig", "apiService", "authService", "helperService", "confirmation"];

    function BranchDetailsController($timeout, appConfig, branchConfig, apiService, authService, helperService, confirmation) {

        var BranchDetailsCtrl = this;

        function Init() {
            var currentBranch = BranchDetailsCtrl.currentBranch[BranchDetailsCtrl.currentBranch.code].ePage.Entities;

            BranchDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Branch_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBranch
            };

            BranchDetailsCtrl.ePage.Masters.Config = branchConfig;

            /* Function */
            BranchDetailsCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            BranchDetailsCtrl.ePage.Masters.AddNewRow = AddNewRow;
            BranchDetailsCtrl.ePage.Masters.RemoveRow = RemoveRow;
            BranchDetailsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            BranchDetailsCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            BranchDetailsCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            BranchDetailsCtrl.ePage.Masters.OnChangeValidations = OnChangeValidations;

            BranchDetailsCtrl.ePage.Masters.DropDownMasterList = {
                "JobType": {
                    "ListSource": []
                },
                "BussType": {
                    "ListSource": []
                },
                "ModeofTransport": {
                    "ListSource": []
                }
            };
            GetMastersDropDownList();
        };

        //#region GetMastersDropDownList
        function GetMastersDropDownList() {
            var typeCodeList = ["JOBTYPE", "BUSSTYPE", "MODEOFTRANSPORT"];
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
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        BranchDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        BranchDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region SelectedLookupData 
        function SelectedLookupData($index, $item, type) {
            if ($item) {
                if (type == 'Country') {
                    OnChangeValidations($item.Code, 'E1343');
                } else if (type == 'State') {
                    OnChangeValidations($item.Code, 'E1341');
                } else if (type == 'Company') {
                    OnChangeValidations($item.Code, 'E1345');
                } else if (type == 'HomePort') {
                    OnChangeValidations($item.Code, 'E1346');
                }
            }
        }
        //#endregion

        //#region AddNewRow, RemoveRow
        function AddNewRow() {
            var obj = {
                "PK":"",
                "JobType": "",
                "BusinessType": "",
                "ModeOfTransport": "",
                "Currency": "",
                "CfxPercentage": "",
                "CfxMin": "",
                "BRANCHFK": "",
                "IsModified": false,
                "IsDeleted": false,
                "LineNo": BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.length + 1
            };

            BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.push(obj);
            BranchDetailsCtrl.ePage.Masters.selectedRow = BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("BranchDetailsCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        apiService.get("eAxisAPI", branchConfig.Entities.API.Branch.API.Delete.Url + value.PK).then(function (response) {
                            console.log("Success");
                        });
                    }
                });

                for (var i = BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.length - 1; i >= 0; i--) {
                    if (BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift[i].SingleSelect && BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift[i].IsDeleted) {
                        BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.splice(i, 1);
                    }
                }

                BranchDetailsCtrl.ePage.Masters.selectedRow = -1;
                BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                BranchDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                BranchDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            }, function () {
                console.log("Cancelled");
            });
        }
        //#endregion

        //#region setSelectedRow, SingleSelectCheckBox, SelectAllCheckBox
        function setSelectedRow($index) {
            BranchDetailsCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox() {
            var Checked = BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                BranchDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
                BranchDetailsCtrl.ePage.Masters.EnableCopyButton = false;
                BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
            } else {
                BranchDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                BranchDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(BranchDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift, function (value, key) {
                if (BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    BranchDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
                    BranchDetailsCtrl.ePage.Masters.EnableCopyButton = false;
                    BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
                }
                else {
                    value.SingleSelect = false;
                    BranchDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                    BranchDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                    BranchDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
                }
            });
        }
        //#endregion   

        //#region ErrorWarning Alert Validation
        function OnChangeValidations(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(BranchDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                BranchDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, BranchDetailsCtrl.currentBranch.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                BranchDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, BranchDetailsCtrl.currentBranch.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init();
    }
})();
