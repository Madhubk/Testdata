(function () {
    "use strict";

    angular.module("Application")
        .controller("GLaccountGeneralController", GLaccountGeneralController);

    GLaccountGeneralController.$inject = ["$timeout", "appConfig", "apiService", "confirmation", "authService", "helperService", "glaccountConfig"];

    function GLaccountGeneralController($timeout, appConfig, apiService, confirmation, authService, helperService, glaccountConfig) {

        var GLaccountGeneralCtrl = this;

        function Init() {

            var currentGlaccount = GLaccountGeneralCtrl.currentGlaccount[GLaccountGeneralCtrl.currentGlaccount.code].ePage.Entities;

            GLaccountGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_GLaccount",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGlaccount
            };

            GLaccountGeneralCtrl.ePage.Masters.Config = glaccountConfig;
            GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = true;

            /* Function */
            GLaccountGeneralCtrl.ePage.Masters.OnIsGlobal = OnIsGlobal;
            GLaccountGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            GLaccountGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;
            GLaccountGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            GLaccountGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            GLaccountGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            GLaccountGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;

            /* DropDown List */
            GLaccountGeneralCtrl.ePage.Masters.DropDownMasterList = {
                "ACCOUNTTYPE": {
                    "ListSource": []
                },
                "BALANCETYPE": {
                    "ListSource": []
                }
            };

            InitGLccount();
            GetMastersDropDownList();
        }

        //#region InitGLccount
        function InitGLccount() {
            if (!GLaccountGeneralCtrl.currentGlaccount.isNew) {
                GLaccountGeneralCtrl.ePage.Masters.IsGlobalDisabled = true;
            }
        }
        //#endregion

        //#region DropDown List
        function GetMastersDropDownList() {
            var typeCodeList = ["ACCOUNTTYPE", "BALANCETYPE"];
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
                        GLaccountGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        GLaccountGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region AddNewRow, RemoveRow
        function AddNewRow() {
            var obj = {
                "PK": "",
                "CompanyCode": "",
                "CompanyName": "",
                "GC_Company": "",
                "IsModified": false,
                "IsDeleted": false,
                "Createdby": authService.getUserInfo().UserId,
                "CreatedDateTime": new Date(),
                "LineNo": GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.length + 1
            };

            GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.push(obj);
            GLaccountGeneralCtrl.ePage.Masters.selectedRow = GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("GLaccountGeneralCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        apiService.get("eAxisAPI", glaccountConfig.Entities.API.GLaccount.API.Delete.Url + value.PK).then(function (response) {
                            console.log("Success");
                        });
                    }
                });

                for (var i = GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.length - 1; i >= 0; i--) {
                    if (GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter[i].SingleSelect && GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter[i].IsDeleted) {
                        GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.splice(i, 1);
                    }
                }

                GLaccountGeneralCtrl.ePage.Masters.selectedRow = -1;
                GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            }, function () {
                console.log("Cancelled");
            });
        }
        //#endregion

        //#region OnIsGlobal
        function OnIsGlobal($item) {
            if ($item && GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.length > 0) {
                GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter = [];
            }
        }
        //#endregion

        //#region SelectedLookupData
        function SelectedLookupData($index, $item) {
        }
        //#endregion

        //#region setSelectedRow, SingleSelectCheckBox, SelectAllCheckBox
        function setSelectedRow($index) {
            GLaccountGeneralCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox() {
            var Checked = GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
            } else {
                GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter, function (value, key) {
                if (GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                }
                else {
                    value.SingleSelect = false;
                    GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                }
            });
        }
        //#endregion

        Init()
    }
})();