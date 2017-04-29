angular.module('starter.controllers', [])
    .controller('HomeCtrl', function ($window, $timeout, ScanHistory) {
        try {
            this.lastScan = ScanHistory.findLast();
        } catch (e) {
            this.lastScan = undefined;
        }
        this.scan = function () {
            $window.cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (! result.cancelled) {
                        ScanHistory.add(result.text);
                        $timeout(function () {
                            this.lastScan = ScanHistory.findLast();
                        }.bind(this));
                    }
                }.bind(this),
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );
        }.bind(this);
    })
    .controller('HistoryCtrl', function ($scope, ScanHistory) {
        this.scanList = [];
        $scope.$on('$ionicView.enter', function () {
            this.scanList = ScanHistory.findAll().reverse();
        }.bind(this));
    })
    .controller('DetailCtrl', function ($state, $ionicHistory, ScanHistory) {
        try {
            this.scan = ScanHistory.fetchById($state.params.id);
        } catch (e) {
            this.scan = undefined;
        }
        this.goBack = function () {
            if ($ionicHistory.backView() === null) {
                $state.go('history');
            } else {
                $ionicHistory.goBack();
            }
        };
    })
;
