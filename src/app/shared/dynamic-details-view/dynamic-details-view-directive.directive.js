(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicDetailsView", DynamicDetailsViewDirective);

    DynamicDetailsViewDirective.$inject = ["$templateCache"];

    function DynamicDetailsViewDirective($templateCache) {
        var _template = `<div class="clearfix dynamic-details-view-header" data-ng-if="DynamicDetailsViewDirectiveCtrl.mode == '0' && DynamicDetailsViewDirectiveCtrl.ePage.Masters.AppCode != 'TC'">
            <span data-ng-bind="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Title || 'Title'"></span>
        </div>
        <div class="clearfix">
            <dynamic-control data-ng-if="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry" input="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry"
                mode="D" control-style="" default-filter="DynamicDetailsViewDirectiveCtrl.ePage.Masters.defaultFilter" is-save-btn="true"
                controls-data="DynamicDetailsViewDirectiveCtrl.ePage.Masters.ControlsData($item)" view-type="2" selected-grid-row="DynamicDetailsViewDirectiveCtrl.ePage.Masters.SelectedGridRow($item)"
                pkey="DynamicDetailsViewDirectiveCtrl.ePage.Masters.Pkey"></dynamic-control>
        </div>`;
        $templateCache.put("DynamicDetailsView.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "DynamicDetailsView.html",
            controller: "DynamicDetailsViewDirectiveController",
            controllerAs: "DynamicDetailsViewDirectiveCtrl",
            scope: {
                dataentryName: "=",
                pkey: "=",
                mode: "=",
                defaultFilter: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("DynamicDetailsViewDirectiveController", DynamicDetailsViewController);

    DynamicDetailsViewController.$inject = ["$scope", "$uibModal", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function DynamicDetailsViewController($scope, $uibModal, authService, apiService, helperService, toastr, appConfig) {
        var DynamicDetailsViewDirectiveCtrl = this;

        function Init() {
            DynamicDetailsViewDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DynamicDetailsViewDirectiveCtrl.ePage.Masters.AppCode = authService.getUserInfo().AppCode;

            DynamicDetailsViewDirectiveCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.CloseModal = CloseModal;
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.ControlsData = ControlsData;

            if (DynamicDetailsViewDirectiveCtrl.dataentryName) {
                DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryName = DynamicDetailsViewDirectiveCtrl.dataentryName;
            }

            if (DynamicDetailsViewDirectiveCtrl.pkey) {
                DynamicDetailsViewDirectiveCtrl.ePage.Masters.Pkey = DynamicDetailsViewDirectiveCtrl.pkey;
            }

            GetDynamicControl();
        }

        function GetDynamicControl() {
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry = undefined;
            var _filter = {
                DataEntryName: DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryName,
                IsRoleBassed: false,
                IsAccessBased: false
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    var _isEmpty = angular.equals({}, _response);

                    if (!_isEmpty) {
                        _response.Entities.map(function (value1, key1) {
                            value1.ConfigData.map(function (value2, key2) {
                                if (value2.AttributesDetails.UIControl == "tcgrid") {
                                    if (DynamicDetailsViewDirectiveCtrl.ePage.Masters.Pkey) {
                                        value2.AttributesDetails.Visible = true;
                                    }
                                }
                            });
                        });

                        if (DynamicDetailsViewDirectiveCtrl.defaultFilter) {
                            _response.Entities.map(function (value, key) {
                                var _isEmpty = angular.equals({}, value.Data);
                                if (_isEmpty) {
                                    value.Data = DynamicDetailsViewDirectiveCtrl.defaultFilter;
                                } else {
                                    for (x in DynamicDetailsViewDirectiveCtrl.defaultFilter) {
                                        value.Data[x] = DynamicDetailsViewDirectiveCtrl.defaultFilter[x];
                                    }
                                }
                            });
                        }

                        DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry = _response;
                    }
                }
            });
        }

        function ControlsData($item) {
            // DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry = undefined;
            // DynamicDetailsViewDirectiveCtrl.ePage.Masters.Pkey = undefined;
            var _input = $item[0];
            Save(_input);
        }

        function Save(input) {
            var _input = {
                DataEntryName: DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryName,
                ProcessName: DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryName,
                Entities: [{
                    EntityName: input.EntityName,
                    Data: input.Data
                }],
                Key: DynamicDetailsViewDirectiveCtrl.ePage.Masters.Pkey,
                WorkitemID: "",
                IsComplete: false
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.SaveAndComplete.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                }
            });
        }

        // TC Grid
        function SelectedGridRow($item) {
            if ($item.action === "edit" || $item.action === "dblClick") {
                var _detailKey = $item.data.entity[$item.DataEntry.GridConfig.DetailKey];
                Edit($item.DataEntry.DataEntryName, _detailKey);
            } else if ($item.action === "new") {
                Edit($item.DataEntry.DataEntryName);
            }
        }

        function EditModalInstance() {
            return DynamicDetailsViewDirectiveCtrl.ePage.Masters.EditGridModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-grid-edit-modal right",
                scope: $scope,
                template: ` <div class="modal-header">
                                    <button type="button" class="close" ng-click="DynamicDetailsViewDirectiveCtrl.ePage.Masters.CloseModal()">&times;</button>
                                    <h5 class="modal-title" id="modal-title">
                                        <strong>{{DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryNameCopy}}</strong>
                                    </h5>
                                </div>
                                <div class="modal-body pt-10" id="modal-body">
                                    <dynamic-details-view data-ng-if="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryNameCopy" dataentry-name="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryNameCopy" pkey="DynamicDetailsViewDirectiveCtrl.ePage.Masters.PkeyCopy" mode="1" default-filter="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DefaultFilter"></dynamic-details-view>
                                </div>`
            });
        }

        function CloseModal() {
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.EditGridModal.dismiss('cancel');
        }

        function Edit(dataEntryName, key) {
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities.map(function (value1, key1) {
                value1.ConfigData.map(function (value2, key2) {
                    if (value2.AttributesDetails.UIControl == "tcgrid") {
                        if (value2.AttributesDetails.Options) {
                            if (typeof value2.AttributesDetails.Options == "string") {
                                var _options = JSON.parse(value2.AttributesDetails.Options);
                            } else {
                                var _options = value2.AttributesDetails.Options;
                            }

                            if (_options.FilterInput) {
                                DynamicDetailsViewDirectiveCtrl.ePage.Masters.DefaultFilter = {};
                                _options.FilterInput.map(function (value3, key3) {
                                    if (value3.ParentRef == "true") {
                                        DynamicDetailsViewDirectiveCtrl.ePage.Masters.DefaultFilter[value3.FieldName] = value1.Data[value3.ValueRef];
                                    } else {
                                        DynamicDetailsViewDirectiveCtrl.ePage.Masters.DefaultFilter[value3.FieldName] = value3.ValueRef;
                                    }
                                });
                            }
                        }
                    }
                });
            });

            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryNameCopy = dataEntryName;
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.PkeyCopy = key;

            EditModalInstance().result.then(function (response) {}, function () {});
        }

        Init();
    }
})();
