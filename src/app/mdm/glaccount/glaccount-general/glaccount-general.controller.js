(function () {
    "use strict";

    angular.module("Application")
        .controller("GLaccountGeneralController", GLaccountGeneralController);

        GLaccountGeneralController.$inject = ["$timeout","helperService", "glaccountConfig"];

    function GLaccountGeneralController($timeout,helperService, glaccountConfig) {

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
           
            /* Function */
            GLaccountGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            GLaccountGeneralCtrl.ePage.Masters.AddNewRow=AddNewRow;
            GLaccountGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            GLaccountGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;        
            GLaccountGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            GLaccountGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;

            //InitGLccount();
            console.log("Check:", GLaccountGeneralCtrl.ePage.Entities.Header.Data);
        }

        //#region GLccount
        // function InitGLccount(){
        //     if (GLaccountGeneralCtrl.currentGlaccount.isNew) {
        //         GLaccountGeneralCtrl.ePage.Entities.Header.Data.IsValid = true;
        //     }
        // }
        //#endregion
        function GetMastersDropDownList() {
            var typeCodeList = ["EXRATETYPE", "EXSUBRATE","MODEOFTRANSPORT","JOBTYPE","BUSSTYPE"];
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
        function AddNewRow() {
            var obj = {
                "Company": "",
                "CompanyName": "",
                "CreatedBy": "",
                "ModifiedBy": "",                
                "IsModified": false,
                "IsDeleted": false,
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
                        apiService.get("eAxisAPI", companyConfig.Entities.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
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
                GLaccountGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            }, function () {
                console.log("Cancelled");
            });
        }

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
                GLaccountGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
            } else {
                GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                GLaccountGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(GLaccountGeneralCtrl.ePage.Entities.Header.Data.UIAccGLHeaderCompanyFilter, function (value, key) {
                if (GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                    GLaccountGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                    GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
                }
                else {
                    value.SingleSelect = false;
                    GLaccountGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                    GLaccountGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                    GLaccountGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
                }
            });
        }


        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(GLaccountGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                GLaccountGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, GLaccountGeneralCtrl.currentGlaccount.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                GLaccountGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, GLaccountGeneralCtrl.currentGlaccount.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();