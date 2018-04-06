(function () {
    "use strict";

    angular
        .module("Application")
        .controller("consignorDocPopUpModalController", ConsignorDocPopUpModalController);

    ConsignorDocPopUpModalController.$inject = ["helperService", "appConfig", "$uibModalInstance", "APP_CONSTANT", "apiService", "authService", "$injector", "organizationConfig", "toastr", "param"];

    function ConsignorDocPopUpModalController(helperService, appConfig, $uibModalInstance, APP_CONSTANT, apiService, authService, $injector, organizationConfig, toastr, param) {
        var ConsignorDocPopUpModalCtrl = this;

        function Init() {
            ConsignorDocPopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ModeModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            console.log(param.Header)
            
            ConsignorDocPopUpModalCtrl.ePage.Masters.DocData = {};
            ConsignorDocPopUpModalCtrl.ePage.Masters.Ok = Save;
            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
            ConsignorDocPopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            if(param.Mode == "New") { 
                ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Add";
                ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView = param.Data;
            } else {
                ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Update";
                ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView = param.Data.data;
            }
            
             // DatePicker
            ConsignorDocPopUpModalCtrl.ePage.Masters.DatePicker = {};
            ConsignorDocPopUpModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConsignorDocPopUpModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConsignorDocPopUpModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }
        // -------------Date time picker-------------
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ConsignorDocPopUpModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function Cancel() {
            // body...
            $uibModalInstance.dismiss('cancel');
        }
        function Save() {
            // body...
            var _isEmpty = angular.equals({}, ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView);
    
            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = true;
            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";

            if (!_isEmpty) {
                if (param.Mode=="New") {
                    ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView.PK = "";
                    ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView.IsModified = false;
                    ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView.IsDeleted = false;
                    ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView.ORG_FK = param.OrgHeader_PK;
                    ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView.EntityRefKey = "";
                    ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView.IsModified = false;

                    apiService.post("eAxisAPI", param.Header.JobRequiredDocument.API.Insert.Url, [ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView]).then(function (response) {
                        if (response.data.Response) {
                            console.log(response.data.Response)
                            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            $uibModalInstance.close(response.data.Response[0]);
                        } else {
                            toastr.error("Save failed..")
                            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        }
                    });
                } else if (param.Mode == "Edit") {
                    ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView = filterObjectUpdate(ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView, "IsModified");

                    apiService.post("eAxisAPI", param.Header.JobRequiredDocument.API.Update.Url, ConsignorDocPopUpModalCtrl.ePage.Masters.DocData.FormView).then(function(response){
                        if (response.data.Response) {
                            console.log(response.data.Response)
                            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            $uibModalInstance.close(response.data.Response);
                        } else {
                            toastr.error("Save failed..")
                            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            ConsignorDocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        }
                    });
                }

            } else {
                toastr.warning("Can't save empty fields...")
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
