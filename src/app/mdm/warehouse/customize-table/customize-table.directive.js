(function () {
    "use strict";

    angular
        .module("Application")
        .directive("customizeTable", CustomizeTable)
        .directive("keyEvents", KeyEvents)
        .directive("watchTable", WatchTable)
        .directive("doNotChange", DoNotChange)
        .filter("tableslice", TableSlice);


    CustomizeTable.$inject = ["$uibModal", "apiService", "appConfig", "authService", "toastr"];
    KeyEvents.$inject = ["$document", "$window"];


    //#region Key Events Directive
    function KeyEvents($document, $window) {
        return {
            restrict: 'EA',
            scope: {
                tableObject: '=',
                enable: '=',
                selectedRow: '=',
                uniqueId: '@'
            },
            link: function (scope, elem, attrs, ctrl) {
                var elemFocus = false;
                elem.on('mouseenter', function () {
                    elemFocus = true;
                });
                elem.on('mouseleave', function () {
                    elemFocus = false;
                });

                // $(document).ready(function() {
                //     $('tbody').scroll(function(e) { detect a scroll event on the tbody

                //       $('thead').css("left", -$("tbody").scrollLeft()); fix the thead relative to the body scrolling
                //        $('thead th:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first cell of the header
                //         $('tbody td:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first column of tdbody
                //     });
                //   });


                $document.ready(function () {
                    $('.fixedheader table').scroll(function (e) {
                        $('#' + scope.uniqueId + ' ' + 'table').scroll(function (e) {

                            $('#' + scope.uniqueId + '  ' + 'thead').css("left", -$('#' + scope.uniqueId + '  ' + "tbody").scrollLeft());
                            $('#' + scope.uniqueId + '  ' + 'thead th:nth-child(1)').css("left", $('#' + scope.uniqueId + '  ' + "table").scrollLeft() - 0);
                            $('#' + scope.uniqueId + '  ' + 'tbody td:nth-child(1)').css("left", $('#' + scope.uniqueId + '  ' + "table").scrollLeft());

                            $('#' + scope.uniqueId + '  ' + 'thead').css("top", -$('#' + scope.uniqueId + '  ' + "tbody").scrollTop());
                            $('#' + scope.uniqueId + '  ' + 'thead tr th').css("top", $('#' + scope.uniqueId + '  ' + "table").scrollTop());

                        });
                    });
                })

                $document.bind('keydown', function (e) {
                    if (elemFocus && scope.enable) {
                        if (e.keyCode == 38) {
                            if (scope.selectedRow == 0) {
                                return;
                            }
                            scope.selectedRow--;
                            scope.$apply();
                            e.preventDefault();
                        }
                        if (e.keyCode == 40) {
                            if (scope.selectedRow == scope.tableObject.length - 1) {
                                return;
                            }
                            scope.selectedRow++;
                            scope.$apply();
                            e.preventDefault();
                        }
                    }
                });

            }
        };
    }
    //#endregion

    //#region Customize Table
    function CustomizeTable($uibModal, apiService, appConfig, authService, toastr) {
        return {
            restrict: "EA",
            link: Link,
            scope: {
                enable: "=",
                tableProperties: '=',
                uniqueId: '@',
                userValue: '=',
                entitySource: '@',
            },
        }

        function Link(scope, elem, attr) {
            if (scope.enable) {
                scope.enable = false;
                openuibmodal(scope, elem, attr);
            }
        }

        function openuibmodal(scope, elem, attr) {
            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right customtable",
                templateUrl: "app/mdm/warehouse/customize-table/customize-table.html",
                controller: function ($scope, $uibModalInstance) {
                    $scope.TableProperties = scope.tableProperties;
                    $scope.TableObject = scope.tableObject;
                    $scope.uniqueId = scope.uniqueId;
                    $scope.userValue = scope.userValue;
                    $scope.entitySource = scope.entitySource;

                    $scope.Cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.Save = function () {
                        if ($scope.userValue) {
                            var _input = $scope.userValue;
                            _input.Value = JSON.stringify($scope.TableProperties);
                            _input.IsModified = true;
                        } else {
                            var _input = {
                                "SAP_FK": authService.getUserInfo().AppPK,
                                "AppCode": authService.getUserInfo().AppCode,
                                "TenantCode": authService.getUserInfo().TenantCode,
                                "SourceEntityRefKey": authService.getUserInfo().UserId,
                                "EntitySource": $scope.entitySource,
                                "Key": "InlineEdit",
                                "IsJSON": true,
                                "IsModified": true
                            };
                            _input.Value = JSON.stringify($scope.TableProperties);
                        }
                        if ($scope.entitySource) {
                            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                                if (response.data.Response) {
                                    $scope.userValue = response.data.Response[0];
                                    toastr.success("Saved Successfully");
                                }
                            })
                        }
                    }


                    $scope.DontDislpay = 0;
                    angular.forEach($scope.TableProperties.HeaderProperties, function (value, key) {
                        if (value.display == false) {
                            $scope.DontDislpay++;
                        }
                    })

                    $scope.OK = function (item) {
                        angular.forEach($scope.TableProperties.HeaderProperties, function (value, key) {

                            value.position = key + 1;
                            $scope.TableProperties[value.property].width = value.width;
                            $scope.TableProperties[value.property].position = value.position;

                            if (value.isenabled) {
                                $scope.TableProperties[value.property].isenabled = true;
                            } else {
                                $scope.TableProperties[value.property].isenabled = false;
                            }

                            if (document.getElementById(value.property)) {
                                document.getElementById(value.property).style.order = value.position;
                            }

                        });

                        $scope.getelement = document.getElementById($scope.uniqueId);
                        if ($scope.getelement.children.tableBody) {

                            $scope.mydata = $scope.getelement.children.tableBody;
                            var checked = true
                            for (var i = 0; i < $scope.getelement.children.length; i++) {
                                if (checked) {
                                    $scope.CurrentCells = $scope.mydata.cells;
                                    orderproperty($scope.CurrentCells);
                                    if ($scope.mydata.nextElementSibling) {
                                        $scope.mydata = $scope.mydata.nextElementSibling;
                                    } else {
                                        checked = false;
                                    }
                                }
                            }
                        }
                        if (item == true) {
                            $scope.Save();
                        }
                        $uibModalInstance.close();
                    }

                    function orderproperty(item) {
                        angular.forEach(item, function (value, key) {
                            value.style.order = $scope.TableProperties[value.id].position;
                        })
                    }
                }

            });
        }
    }
    //#endregion

    function WatchTable() {
        var exports = {
            restrict: "EA",
            link: Link,
            scope: {
                tableProperties: '=',
                uniqueId: '@',
                rowPosition: "="
            },
        }
        return exports;

        function Link(scope, elem, attr) {
            
            // if you declare function with scope.myFunction = function(){} then it will be called by scope.myfunction() but it should be called after the function.
            // If it called before the function declaration line it will show error. Another thing use function without scope. and call without scope. 
            // then we can call even before or after the function declaration.

            scope.TableProperties = scope.tableProperties;
            scope.UniqueID = scope.uniqueId;

            angular.forEach(scope.TableProperties.HeaderProperties, function (value, key) {

                value.position = key + 1;
                scope.TableProperties[value.property].width = value.width;
                scope.TableProperties[value.property].position = value.position;

                if (value.isenabled) {
                    scope.TableProperties[value.property].isenabled = true;
                } else {
                    scope.TableProperties[value.property].isenabled = false;
                }

                if (document.getElementById(value.property)) {
                    document.getElementById(value.property).style.order = value.position;
                }
            });

            scope.getelement = document.getElementById(scope.UniqueID);
            if (scope.getelement.children.tableBody) {

                if (scope.rowPosition) {
                    scope.CurrentCells = scope.getelement.children[scope.rowPosition].cells;
                    orderproperty(scope.CurrentCells);
                } else {
                    scope.mydata = scope.getelement.children.tableBody;
                    var checked = true
                    for (var i = 0; i < scope.getelement.children.length; i++) {
                        if (checked) {
                            scope.CurrentCells = scope.mydata.cells;
                            orderproperty(scope.CurrentCells);
                            if (scope.mydata.nextElementSibling) {
                                scope.mydata = scope.mydata.nextElementSibling;
                            } else {
                                checked = false;
                            }
                        }
                    }
                }
            }


            function orderproperty(item) {
                angular.forEach(item, function (value, key) {
                    value.style.order = scope.TableProperties[value.id].position;
                });
            }
        }
    }

    //If we have pagination in Table 
    function TableSlice() {
        return function (tableobject, startindex, endindex) {
            return tableobject.slice(startindex, endindex);
        }
    }

    //Directive for not changing the view value
    function DoNotChange(){
        return {
            require: 'ngModel',
            restrict :"EA",
            link : Link,
            scope : {
                changed : '='
            }
        }

        function Link(scope,ele,att,ngModelCtrl){
            ngModelCtrl.$parsers.push(function(value) {
                if(scope.changed==false){
                    ngModelCtrl.$viewValue = ngModelCtrl.$modelValue;
                    ngModelCtrl.$render();
                    return ngModelCtrl.$viewValue;
                }
            });

            /* 
            1.First value assigning view value. We are not using setViewvalue.
            2.Rendering the UI textfield and updating in View side.
            3.Return function is used to update the model value. We have assinged ViewValue directly,
            So model value will alsow be updated so overcome we are returning to update the model value again.
            */
        }
    }
    
})();