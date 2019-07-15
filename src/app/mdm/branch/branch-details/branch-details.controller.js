(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BranchDetailsController", BranchDetailsController);

    BranchDetailsController.$inject = ["$timeout", "appConfig", "apiService", "authService", "helperService"];

    function BranchDetailsController($timeout, appConfig, apiService, authService, helperService) {

        var BranchDetailsCtrl = this;

        function Init() {

            var currentBranch = BranchDetailsCtrl.currentBranch[BranchDetailsCtrl.currentBranch.label].ePage.Entities;

            BranchDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Branch_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBranch
            };

            BranchDetailsCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            BranchDetailsCtrl.ePage.Masters.AddNewRow = AddNewRow;
            BranchDetailsCtrl.ePage.Masters.RemoveRow = RemoveRow;
            BranchDetailsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            BranchDetailsCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            BranchDetailsCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;

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
            if (type == "Organization") {
                BranchDetailsCtrl.ePage.Entities.Header.Data.Code = "";
            }
        }
        //#endregion

        //#region AddNewRow, RemoveRow
        function AddNewRow() {
            var obj = {
                "JobType": "",
                "BusinessType": "",
                "ModeOfTransport": "",
                "Currency": "",
                "CfxPercentage": "",
                "CfxMin": "",
                "CompanyFK": BranchDetailsCtrl.ePage.Entities.Header.Data.UICmpBranch.PK,
                "CreatedBy": authService.getUserInfo().UserId,
                "ModifiedBy": "",
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
                    // if (value.SingleSelect && value.PK && value.IsDeleted) {
                    //     apiService.get("eAxisAPI", branchConfig.Entities.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
                    //         console.log("Success");
                    //     });
                    // }
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

        Init();
    }
})();
