(function () {
    "use strict";

    angular
        .module("Application")
        .directive("generateDbScript", GenerateDBScript);

    GenerateDBScript.$inject = ["$templateCache", "$uibModal", "helperService", "appConfig", "apiService", "authService", "toastr"];

    function GenerateDBScript($templateCache, $uibModal, helperService, appConfig, apiService, authService, toastr) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" data-ng-click="Cancel()">&times;</button>
            <h5 class="modal-title"><strong>Script</strong></h5>
        </div>
        <div class="modal-body p-10">
            <div class="clearfix border-bottom mb-10">
                <div class="col-sm-3">
                    <div class="form-group">
                        <label for="" class="control-label">Table</label>
                        <input type="text" class="form-control" placeholder="Name" data-ng-model="Model.ObjectName" data-ng-disabled="config.IsEnableTable != true"/>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="form-group">
                        <label for="" class="control-label">PK</label>
                        <input type="text" class="form-control" placeholder="PK" data-ng-model="Model.ObjectId" data-ng-disabled="config.IsEnablePK != true"/>
                    </div>
                </div>
                <div class="col-sm-2">
                    <div class="form-group">
                        <label for="" class="control-label">TenantCode</label>
                        <select chosen class="form-control" data-ng-options="x.TenantCode as (x.TenantCode + ' - ' + x.TenantName) for x in TenantList" data-ng-model="Model.TNTCODE" search-contains="true" data-ng-disabled="config.IsEnableTenant != true">
                            <option value="">--Select--</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-1">
                    <div class="form-group">
                        <label for="" class="control-label"></label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" class="colored-blue" data-ng-model="Model.Insert" data-ng-true-value="1" data-ng-false-value="undefined"> 
                                <span class="text">Insert</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-sm-1">
                    <div class="form-group">
                        <label for="" class="control-label"></label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" class="colored-blue" data-ng-model="Model.Update" data-ng-true-value="1" data-ng-false-value="undefined">
                                <span class="text">Update</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-sm-1">
                    <div class="form-group">
                        <label for="" class="control-label"></label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" class="colored-blue" data-ng-model="Model.Delete" data-ng-true-value="1" data-ng-false-value="undefined">
                                <span class="text">Delete</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-sm-1 pr-0">
                    <div class="form-group">
                        <label for="" class="control-label">&nbsp;</label>
                        <div>
                            <button class="btn btn-primary btn-sm" data-ng-click="GetDBScript()" data-ng-disabled="IsDisableGenerateBtn" data-ng-bind="GenerateBtnTxt"></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix script-container">
                <div class="clearfix text-center font-120 p-20" data-ng-if="!ScriptList && IsBtnClicked">
                    <i class="fa fa-spin fa-spinner"></i>
                </div>
                <div class="clearfix text-center font-120 p-20" data-ng-if="ScriptList && ScriptList.length == 0 && IsBtnClicked">
                    <i>No Records...!</i>
                </div>
                <div class="clearfix" style="word-break: break-word; white-space: pre-line;" data-ng-repeat="x in ScriptList"
                    data-ng-if="ScriptList && ScriptList.length > 0 && IsBtnClicked">
                    <div class="clearfix" data-ng-bind="x.Column1" data-ng-if="!x.Column1"></div>
                    <div class="clearfix text-center p-20" data-ng-if="!x.Column1">
                        <i>Script Not Found...!</i>
                    </div>
                </div>
            </div>
        </div>`;
        $templateCache.put("GenerateDBScipt.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                input: "=",
                config: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            scope.Cancel = Cancel;
            scope.GetDBScript = GetDBScript;

            scope.Model = {};
            scope.IsBtnClicked = false;
            scope.IsDisableGenerateBtn = false;
            scope.GenerateBtnTxt = "Generate";

            GetTenantList();

            ele.on('click', function ($event) {
                scope.Model = {
                    "ObjectName": scope.input.ObjectName,
                    "ObjectId": scope.input.ObjectId,
                    "TNTCODE": authService.getUserInfo().TenantCode
                };
                OpenModal().result.then(function (response) {}, function () {
                    Cancel();
                });
            });

            function GetTenantList() {
                var _filter = {};
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.SecTenant.API.MasterFindAll.FilterID
                };

                apiService.post("authAPI", appConfig.Entities.SecTenant.API.MasterFindAll.Url, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        scope.TenantList = response.data.Response;
                    } else {
                        scope.TenantList = [];
                    }
                });
            }

            function GetDBScript() {
                var _input = angular.copy(scope.Model);

                if (_input.ObjectId && _input.ObjectName) {
                    scope.ScriptList = undefined;
                    scope.IsBtnClicked = true;
                    scope.IsDisableGenerateBtn = true;
                    scope.GenerateBtnTxt = "Please Wait...";
                    apiService.post("eAxisAPI", appConfig.Entities.Scripts.API.WriteScript.Url, _input).then(function SuccessCallback(response) {
                        if (response.data.Response) {
                            scope.ScriptList = response.data.Response;
                        } else {
                            scope.ScriptList = [];
                        }
                        scope.IsDisableGenerateBtn = false;
                        scope.GenerateBtnTxt = "Generate";
                    }, function ErrorCallBack(error) {
                        scope.IsBtnClicked = false;
                        scope.IsDisableGenerateBtn = false;
                        scope.GenerateBtnTxt = "Generate";
                    });
                } else {
                    toastr.warning("Entity and PK are Mandatory...!");
                }
            }

            function OpenModal() {
                return scope.modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "generate-db-script right",
                    scope: scope,
                    templateUrl: 'GenerateDBScipt.html'
                })
            }

            function Cancel() {
                scope.modalInstance.dismiss('cancel');
            }
        }
    }
})();
