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
            <div class="clearfix border-bottom">
                <div class="col-sm-2 pr-0">
                    <div class="form-group">
                        <label for="" class="control-label">Table</label>
                        <input type="text" class="form-control" placeholder="Name" data-ng-model="Model.ObjectName" data-ng-disabled="config.IsEnableTable != true"/>
                    </div>
                </div>
                <div class="col-sm-2 pr-0">
                    <div class="form-group">
                        <label for="" class="control-label">PK</label>
                        <input type="text" class="form-control" placeholder="PK" data-ng-model="Model.ObjectId" data-ng-disabled="config.IsEnablePK != true"/>
                    </div>
                </div>
                <div class="col-sm-2 pr-0">
                    <div class="form-group">
                        <label for="" class="control-label">TenantCode</label>
                        <select chosen class="form-control" data-ng-options="x.TenantCode as (x.TenantCode + ' - ' + x.TenantName) for x in TenantList" data-ng-model="Model.TNTCODE" search-contains="true" data-ng-disabled="config.IsEnableTenant != true">
                            <option value="">--Select--</option>
                        </select>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group ml-20 pull-left">
                        <label for="" class="control-label"></label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" class="colored-blue" data-ng-model="Model.Insert" data-ng-true-value="1" data-ng-false-value="undefined"> 
                                <span class="text">Insert</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group ml-20 pull-left">
                        <label for="" class="control-label"></label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" class="colored-blue" data-ng-model="Model.Update" data-ng-true-value="1" data-ng-false-value="undefined">
                                <span class="text">Update</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group ml-20 pull-left">
                        <label for="" class="control-label"></label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" class="colored-blue" data-ng-model="Model.Delete" data-ng-true-value="1" data-ng-false-value="undefined">
                                <span class="text">Delete</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group ml-20 pull-left">
                        <label for="" class="control-label"></label>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" class="colored-blue" data-ng-model="Model.Copy" data-ng-true-value="1" data-ng-false-value="undefined">
                                <span class="text">Copy</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group ml-20 pull-right">
                        <label for="" class="control-label">&nbsp;</label>
                        <div>
                            <button class="btn btn-primary btn-sm ml-10" data-ng-click="GetDBScript()" data-ng-disabled="IsDisableGenerateBtn">
                                <i class="fa fa-file-code-o mr-5"></i> <span data-ng-bind="GenerateBtnTxt"></span>
                            </button>
                         </div>
                    </div>
                </div>
            </div>
            <div class="clearfix script-container">
                <div class="clearfix text-center font-120 p-20" data-ng-if="IsLoading && IsBtnClicked">
                    <i class="fa fa-spin fa-spinner"></i>
                </div>
                <div class="clearfix text-center font-120 p-20" data-ng-if="!ScriptList && !IsLoading && IsBtnClicked">
                    <i>No Records...!</i>
                </div>
                <div class="clearfix" data-ng-if="ScriptList && IsBtnClicked">
                    <div class="clearfix p-10 pl-15 pr-15 border-bottom">
                        <span class="bold font-120">Script</span>
                        <button class="btn btn-primary btn-sm pull-right" data-ng-click="CopyToClipboard()" >Copy Script</button>
                    </div>
                    <div id="GenerateScript" class="clearfix p-10 pl-15 pr-15" style="word-break: break-word; white-space: pre-line; overflow-y: auto; height: calc(100vh - 255px);" data-ng-bind="ScriptList"></div>
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
            scope.CopyToClipboard = CopyToClipboard;
            scope.onclick = onclick;

            ele.on('click', function ($event) {
                scope.IsBtnClicked = false;
                scope.IsLoading = false;
                scope.IsDisableGenerateBtn = false;
                scope.GenerateBtnTxt = "Generate";

                scope.Model = {
                    "ObjectName": scope.input.ObjectName,
                    "ObjectId": scope.input.ObjectId,
                    "TNTCODE": authService.getUserInfo().TenantCode
                };

                OpenModal().result.then(function (response) {}, function () {
                    Cancel();
                });

                GetTenantList();
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
                    scope.IsLoading = true;
                    scope.IsDisableGenerateBtn = true;
                    scope.GenerateBtnTxt = "Please Wait...";
                    apiService.post("eAxisAPI", appConfig.Entities.Scripts.API.WriteScript.Url, _input).then(function SuccessCallback(response) {
                        scope.ScriptList = response.data.Response;
                        scope.IsDisableGenerateBtn = false;
                        scope.GenerateBtnTxt = "Generate";

                        scope.IsLoading = false;

                    }, function ErrorCallBack(error) {
                        scope.IsBtnClicked = false;
                        scope.IsLoading = false;
                        scope.IsDisableGenerateBtn = false;
                        scope.GenerateBtnTxt = "Generate";
                    });
                } else {
                    toastr.warning("Entity and PK are Mandatory...!");
                }
            }

            function CopyToClipboard() {
                helperService.copyToClipboard(document.getElementById("GenerateScript").innerHTML);
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
