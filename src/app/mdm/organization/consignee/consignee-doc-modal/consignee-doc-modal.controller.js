(function () {
    "use strict";

    angular
        .module("Application")
        .controller("docPopUpModalController", DocPopUpModalController);

    DocPopUpModalController.$inject = ["helperService", "appConfig", "$uibModalInstance", "APP_CONSTANT", "apiService", "authService", "$injector", "organizationConfig", "toastr", "param"];

    function DocPopUpModalController(helperService, appConfig, $uibModalInstance, APP_CONSTANT, apiService, authService, $injector, organizationConfig, toastr, param) {
        var DocPopUpModalCtrl = this;

        function Init() {
            DocPopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "ModeModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            console.log(param.Header)
            
            DocPopUpModalCtrl.ePage.Masters.DocData = {};
            DocPopUpModalCtrl.ePage.Masters.Ok = Save;
            DocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
            DocPopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            if(param.Mode == "New") { 
                DocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Add";
                DocPopUpModalCtrl.ePage.Masters.DocData.FormView = param.Data;
            } else {
                DocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Update";
                DocPopUpModalCtrl.ePage.Masters.DocData.FormView = param.Data.data;
            }
            
             // DatePicker
            DocPopUpModalCtrl.ePage.Masters.DatePicker = {};
            DocPopUpModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DocPopUpModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            DocPopUpModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }
        // -------------Date time picker-------------
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            DocPopUpModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function Cancel() {
            // body...
            $uibModalInstance.dismiss('cancel');
        }
        function Save() {
            // body...
            var _isEmpty = angular.equals({}, DocPopUpModalCtrl.ePage.Masters.DocData.FormView);
    
            DocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = true;
            DocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";

            if (!_isEmpty) {
                if (param.Mode=="New") {
                    DocPopUpModalCtrl.ePage.Masters.DocData.FormView.PK = "";
                    DocPopUpModalCtrl.ePage.Masters.DocData.FormView.IsModified = false;
                    DocPopUpModalCtrl.ePage.Masters.DocData.FormView.IsDeleted = false;
                    DocPopUpModalCtrl.ePage.Masters.DocData.FormView.ORG_FK = param.OrgHeader_PK;
                    DocPopUpModalCtrl.ePage.Masters.DocData.FormView.EntityRefKey = "";
                    DocPopUpModalCtrl.ePage.Masters.DocData.FormView.IsModified = false;

                    apiService.post("eAxisAPI", param.Header.JobRequiredDocument.API.Insert.Url, [DocPopUpModalCtrl.ePage.Masters.DocData.FormView]).then(function (response) {
                        if (response.data.Response) {
                            console.log(response.data.Response)
                            DocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            DocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            $uibModalInstance.close(response.data.Response[0]);
                        } else {
                            toastr.error("Save failed..")
                            DocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            DocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        }
                    });
                } else if (param.Mode == "Edit") {
                    DocPopUpModalCtrl.ePage.Masters.DocData.FormView = filterObjectUpdate(DocPopUpModalCtrl.ePage.Masters.DocData.FormView, "IsModified");

                    apiService.post("eAxisAPI", param.Header.JobRequiredDocument.API.Update.Url, DocPopUpModalCtrl.ePage.Masters.DocData.FormView).then(function(response){
                        if (response.data.Response) {
                            console.log(response.data.Response)
                            DocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            DocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            $uibModalInstance.close(response.data.Response);
                        } else {
                            toastr.error("Save failed..")
                            DocPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
                            DocPopUpModalCtrl.ePage.Masters.SaveButtonText = "Save";
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
