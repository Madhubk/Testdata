(function () {
    "use strict";

    angular
        .module("Application")
        .controller("consignorModePopUpModalController", ConsignorModePopUpModalController);

    ConsignorModePopUpModalController.$inject = ["helperService", "appConfig", "$uibModalInstance", "apiService", "authService", "$injector", "organizationConfig", "toastr", "param"];

    function ConsignorModePopUpModalController(helperService, appConfig, $uibModalInstance, apiService, authService, $injector, organizationConfig, toastr, param) {
        var ConsignorModePopUpModalCtrl = this;

        function Init() {
            ConsignorModePopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ModeModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            console.log(param.Header)
            
            ConsignorModePopUpModalCtrl.ePage.Masters.ModeData = {};
            ConsignorModePopUpModalCtrl.ePage.Masters.Ok = Save;
            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
            ConsignorModePopUpModalCtrl.ePage.Masters.DeliveryAddress = {};
            ConsignorModePopUpModalCtrl.ePage.Masters.DeliveryAddress.ListSource = [];
            ConsignorModePopUpModalCtrl.ePage.Masters.DeliveryContact = {};
            ConsignorModePopUpModalCtrl.ePage.Masters.DeliveryContact.ListSource = [];
            ConsignorModePopUpModalCtrl.ePage.Masters.PickupAddress = {};
            ConsignorModePopUpModalCtrl.ePage.Masters.PickupAddress.ListSource = [];
            ConsignorModePopUpModalCtrl.ePage.Masters.PickupContact = {};
            ConsignorModePopUpModalCtrl.ePage.Masters.PickupContact.ListSource = [];

            ConsignorModePopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            if(param.Mode == "New") { 
                ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Add";
                ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView = param.Data;
            } else {
                ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Update";
                ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView = param.Data.data;
            }
            GetCfxTypeList()
            GetServiceLevelList()

        }

        function GetCfxTypeList() {
            var typeCodeList = ["TRANSTYPE", "CNTTYPE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS","JOBADDR"];
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
                typeCodeList.map(function (value, key) {
                    ConsignorModePopUpModalCtrl.ePage.Masters.ModeData[value] = helperService.metaBase();
                    ConsignorModePopUpModalCtrl.ePage.Masters.ModeData[value].ListSource = response.data.Response[value];
                });
            });
        }

        function GetServiceLevelList() {
            ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.ServiceLevel = {}
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.ServiceLevel.ListSource = response.data.Response;
            });
        }

        function Cancel() {
            // body...
            $uibModalInstance.dismiss('cancel');
        }
        function Save() {
            // body...
            var _isEmpty = angular.equals({}, ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView);
    
            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = true;
            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";

            if (!_isEmpty) {
                if (param.Mode=="New") {
                    ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView.PK = "";
                    ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView.IsModified = false;
                    ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView.IsDeleted = false;
                    ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView.OBS_FK = param.OrgHeader_PK;
                    ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView.EntityRefKey = "";
                    ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView.IsModified = false;

                    apiService.post("eAxisAPI", param.Header.OrgBuySupMappingTrnMode.API.Insert.Url, [ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView]).then(function (response) {
                        if (response.data.Response) {
                            console.log(response.data.Response)
                            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            $uibModalInstance.close(response.data.Response[0]);
                        } else {
                            toastr.error("Save failed..")
                            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        }
                    });
                } else if (param.Mode == "Edit") {
                    ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView = filterObjectUpdate(ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView, "IsModified");

                    apiService.post("eAxisAPI", param.Header.OrgBuySupMappingTrnMode.API.Update.Url, ConsignorModePopUpModalCtrl.ePage.Masters.ModeData.FormView).then(function(response){
                        if (response.data.Response) {
                            console.log(response.data.Response)
                            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            $uibModalInstance.close(response.data.Response);
                        } else {
                            toastr.error("Save failed..")
                            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ConsignorModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        }
                    });
                }

            } else {
                toastr.warning("Cannot allow to empty Save...")
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
