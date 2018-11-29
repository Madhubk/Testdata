(function () {
    "use strict";

    angular
        .module("Application")
        .controller("modePopUpModalController", ModePopUpModalController);

    ModePopUpModalController.$inject = ["helperService", "appConfig", "$uibModalInstance", "apiService", "authService", "$injector", "organizationConfig", "toastr", "param"];

    function ModePopUpModalController(helperService, appConfig, $uibModalInstance, apiService, authService, $injector, organizationConfig, toastr, param) {
        var ModePopUpModalCtrl = this;

        function Init() {
            ModePopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ModeModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            
            ModePopUpModalCtrl.ePage.Masters.ModeData = {};
            ModePopUpModalCtrl.ePage.Masters.Ok = Save;
            ModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
            ModePopUpModalCtrl.ePage.Masters.DeliveryAddress = {};
            ModePopUpModalCtrl.ePage.Masters.DeliveryAddress.ListSource = [];
            ModePopUpModalCtrl.ePage.Masters.DeliveryContact = {};
            ModePopUpModalCtrl.ePage.Masters.DeliveryContact.ListSource = [];
            ModePopUpModalCtrl.ePage.Masters.PickupAddress = {};
            ModePopUpModalCtrl.ePage.Masters.PickupAddress.ListSource = [];
            ModePopUpModalCtrl.ePage.Masters.PickupContact = {};
            ModePopUpModalCtrl.ePage.Masters.PickupContact.ListSource = [];

            ModePopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            if(param.Mode == "New") { 
                ModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Add";
                ModePopUpModalCtrl.ePage.Masters.ModeData.FormView = param.Data;
            } else {
                ModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Update";
                ModePopUpModalCtrl.ePage.Masters.ModeData.FormView = param.Data.data;
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
                    ModePopUpModalCtrl.ePage.Masters.ModeData[value] = helperService.metaBase();
                    ModePopUpModalCtrl.ePage.Masters.ModeData[value].ListSource = response.data.Response[value];
                });
            });
        }

        function GetServiceLevelList() {
            ModePopUpModalCtrl.ePage.Masters.ModeData.ServiceLevel = {}
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                ModePopUpModalCtrl.ePage.Masters.ModeData.ServiceLevel.ListSource = response.data.Response;
            });
        }

        function Cancel() {
            // body...
            $uibModalInstance.dismiss('cancel');
        }
        function Save() {
            // body...
            var _isEmpty = angular.equals({}, ModePopUpModalCtrl.ePage.Masters.ModeData.FormView);
    
            ModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = true;
            ModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";

            if (!_isEmpty) {
                if (param.Mode=="New") {
                    ModePopUpModalCtrl.ePage.Masters.ModeData.FormView.PK = "";
                    ModePopUpModalCtrl.ePage.Masters.ModeData.FormView.IsModified = false;
                    ModePopUpModalCtrl.ePage.Masters.ModeData.FormView.IsDeleted = false;
                    ModePopUpModalCtrl.ePage.Masters.ModeData.FormView.OBS_FK = param.OrgHeader_PK;
                    ModePopUpModalCtrl.ePage.Masters.ModeData.FormView.EntityRefKey = "";
                    ModePopUpModalCtrl.ePage.Masters.ModeData.FormView.IsModified = false;

                    apiService.post("eAxisAPI", param.Header.OrgBuySupMappingTrnMode.API.Insert.Url, [ModePopUpModalCtrl.ePage.Masters.ModeData.FormView]).then(function (response) {
                        if (response.data.Response) {
                            console.log(response.data.Response)
                            ModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            $uibModalInstance.close(response.data.Response[0]);
                        } else {
                            toastr.error("Save failed..")
                            ModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        }
                    });
                } else if (param.Mode == "Edit") {
                    ModePopUpModalCtrl.ePage.Masters.ModeData.FormView = filterObjectUpdate(ModePopUpModalCtrl.ePage.Masters.ModeData.FormView, "IsModified");

                    apiService.post("eAxisAPI", param.Header.OrgBuySupMappingTrnMode.API.Update.Url, ModePopUpModalCtrl.ePage.Masters.ModeData.FormView).then(function(response){
                        if (response.data.Response) {
                            console.log(response.data.Response)
                            ModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            $uibModalInstance.close(response.data.Response);
                        } else {
                            toastr.error("Save failed..")
                            ModePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ModePopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
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
