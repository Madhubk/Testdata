(function () {
    "use strict";

    angular
        .module("Application")
        .directive("changePassword", ChangePassword);

    ChangePassword.$inject = ["$uibModal"];

    function ChangePassword($uibModal) {
        var exports = {
            restrict: "EA",
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on('click', function ($event) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "change-password",
                    scope: scope,
                    templateUrl: "app/shared/change-password/change-password.html",
                    controller: "ChangePasswordController",
                    controllerAs: "ChangePasswordCtrl",
                    bindToController: true
                }).result.then(
                    function (response) {
                        console.log(response);
                    },
                    function () {
                        console.log("Cancelled");
                    }
                );
            });
        }
    }

    angular
        .module("Application")
        .controller("ChangePasswordController", ChangePasswordController);

    ChangePasswordController.$inject = ["$scope", "$uibModalInstance", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function ChangePasswordController($scope, $uibModalInstance, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var ChangePasswordCtrl = this;

        function Init() {
            ChangePasswordCtrl.ePage = {
                "Title": "",
                "Prefix": "Change_Password",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ChangePasswordCtrl.ePage.Masters.Data = {};
            ChangePasswordCtrl.ePage.Masters.ChangeButtonText = "Change";
            ChangePasswordCtrl.ePage.Masters.IsChangeButtonClicked = false;

            ChangePasswordCtrl.ePage.Masters.Ok = Ok;
            ChangePasswordCtrl.ePage.Masters.Cancel = Cancel;
            ChangePasswordCtrl.ePage.Masters.ChangePassword = ChangePassword;
        }

        function ChangePassword() {
            if ($scope.changePasswordForm.$valid) {
                if (ChangePasswordCtrl.ePage.Masters.Data.CurrentPassword !== ChangePasswordCtrl.ePage.Masters.Data.NewPassword) {
                    if (ChangePasswordCtrl.ePage.Masters.Data.NewPassword === ChangePasswordCtrl.ePage.Masters.Data.ConfirmPassword) {
                        ChangePasswordCtrl.ePage.Masters.ChangeButtonText = "Please Wait...!";
                        ChangePasswordCtrl.ePage.Masters.IsChangeButtonClicked = true;

                        var _input = {
                            "UserName": authService.getUserInfo().UserId,
                            "CurrentPassword": ChangePasswordCtrl.ePage.Masters.Data.CurrentPassword,
                            "NewPassword": ChangePasswordCtrl.ePage.Masters.Data.NewPassword
                        };

                        apiService.post("authAPI", appConfig.Entities.User.API.ChangePassword.Url, _input).then(function SuccessCallback(response) {
                            if (response.data.Response) {
                                if (response.data.Response === "Password Changed Successfull") {
                                    toastr.success("Password Updated Successfully...!");

                                    ChangePasswordCtrl.ePage.Masters.Ok();
                                } else {
                                    toastr.error(response.data.Response);
                                }
                            } else {
                                console.log("Change Password Empty Response");
                            }
                            ChangePasswordCtrl.ePage.Masters.ChangeButtonText = "Change";
                            ChangePasswordCtrl.ePage.Masters.IsChangeButtonClicked = false;
                        });
                    } else {
                        toastr.warning("New Password and Confirmation Password Should be Same....!", "Password Mismatch!");
                    }
                } else {
                    toastr.warning("Current Password and New Password Should not be Same....!", "Password Mismatch!");
                }
            } else {
                $scope.changePasswordForm.submitted = true;
            }
        }

        function Ok() {
            $uibModalInstance.close();
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
