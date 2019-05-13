(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeMenuController", ChargecodeMenuController);

    ChargecodeMenuController.$inject = ["helperService", "toastr", "authService", "chargecodeConfig", "apiService"];

    function ChargecodeMenuController(helperService, toastr, authService, chargecodeConfig, apiService) {

        var ChargecodeMenuCtrl = this;

        function Init() {

            var currentChargecode = ChargecodeMenuCtrl.currentChargecode[ChargecodeMenuCtrl.currentChargecode.code].ePage.Entities;

            ChargecodeMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentChargecode
            };

            ChargecodeMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ChargecodeMenuCtrl.ePage.Masters.DisableSave = false;
            ChargecodeMenuCtrl.ePage.Masters.Config = chargecodeConfig;
            ChargecodeMenuCtrl.ePage.Masters.ChargecodeMenu = {};
            ChargecodeMenuCtrl.ePage.Masters.ChargecodeMenu.ListSource = ChargecodeMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            /* Function */
            ChargecodeMenuCtrl.ePage.Masters.Validation = Validation;
            ChargecodeMenuCtrl.ePage.Masters.Save = Save;

            if (!ChargecodeMenuCtrl.currentChargecode.isNew) {
                MstDepartmentBackFilter(ChargecodeMenuCtrl.currentChargecode);
            }
        }

        //#region  Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;
            // _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            /* Validation Call */
            // ChargecodeMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            // if (ChargecodeMenuCtrl.ePage.Entities.Header.Validations) {
            //     ChargecodeMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ChargecodeMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            // }

            // if (_errorcount.length == 0) {
            //     var _filter = {};
            //     var _inputField = {
            //         "searchInput": helperService.createToArrayOfObject(_filter),
            //         "FilterID": chargecodeConfig.Entities.API.ChargecodeGroup.API.FindAll.FilterID
            //     };

            //     apiService.post("eAxisAPI", chargecodeConfig.Entities.API.ChargecodeGroup.API.FindAll.Url, _inputField).then(function (response) {
            //         if (response.data.Response) {
            //             ChargecodeMenuCtrl.ePage.Masters.UIChargecodeList = response.data.Response;
            //         }

            //         var _count = ChargecodeMenuCtrl.ePage.Masters.UIChargecodeList.some(function (value, key) {
            //             if (value.Code == _input.Code) {
            //                 return true;
            //             }
            //             else {
            //                 return false;
            //             }
            //         });

            //         if (_count) {
            //             toastr.error("Code is Unique, Rename the Code!.");
            //         } else {
            //             Save($item);
            //         }
            //     });
            // } else {
            //     ChargecodeMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ChargecodeMenuCtrl.currentChargecode);
            // }
            if (_input.UIAccChargeCode.CMP_CountryCode == "IN") {
                if (!_input.UIAccChargeCode.GovtChargeCode) {
                    toastr.error("Could you please enter SAC / HSN Codes.");
                }
                else if (_input.UIAccChargeCode.GovtChargeCode.length > 6) {
                    toastr.error("SAC / HSN codes allowed must be max 6 degits.");
                } else {
                    MstDepartmentFilterList(_input, $item);
                }
            }
            else {
                MstDepartmentFilterList(_input, $item);
            }
        }

        function MstDepartmentFilterList(_input, $item) {
            var _Department = angular.copy(_input.UIAccChargeCode.DepartmentFilterList);
            _input.UIAccChargeCode.DepartmentFilterList = "";
            _Department.map(function (value, key) {
                if (!_input.UIAccChargeCode.DepartmentFilterList) {
                    _input.UIAccChargeCode.DepartmentFilterList = value;
                } else {
                    _input.UIAccChargeCode.DepartmentFilterList = _input.UIAccChargeCode.DepartmentFilterList + ',' + value;
                }
            });
            Save($item);
        }
        //#endregion

        //#region Save
        function Save($item) {
            ChargecodeMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ChargecodeMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIAccChargeCode.PK = _input.PK;
                _input.UIAccChargeCode.CreatedDateTime = new Date();
                _input.UIAccChargeCode.IsValid = true;
                _input.UIAccChargeCode.Source = "ERP";
                _input.UIAccChargeCode.TenantCode = "20CUB";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Chargecode').then(function (response) {
                ChargecodeMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ChargecodeMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    var _index = chargecodeConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                    }).indexOf(ChargecodeMenuCtrl.currentChargecode[ChargecodeMenuCtrl.currentChargecode.code].ePage.Entities.Header.Data.PK);

                    chargecodeConfig.TabList.map(function (value, key) {
                        if (_index == key) {
                            if (value.isNew) {
                                value.label = ChargecodeMenuCtrl.ePage.Entities.Header.Data.UIAccChargeCode.Code;
                                value[ChargecodeMenuCtrl.ePage.Entities.Header.Data.UIAccChargeCode.Code] = value.isNew;
                                delete value.isNew;
                            }
                        }
                    });

                    helperService.refreshGrid();
                    MstDepartmentBackFilter($item);

                    toastr.success("Saved Successfully...!");
                } else if (response.Status === "failed") {
                    toastr.error("Could not Save...!");
                }
            });
        }

        function MstDepartmentBackFilter($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            var _MstDepartmentBackFilter = _input.UIAccChargeCode.DepartmentFilterList.split(',');
            _input.UIAccChargeCode.DepartmentFilterList = _MstDepartmentBackFilter;
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

        Init()
    }
})();