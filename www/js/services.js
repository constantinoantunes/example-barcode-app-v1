angular.module('starter.services', [])
    .service('ScanHistory', function ($window, Scan) {
        var maxHistoryLength = 100;
        this.add = function (code) {
            var item = Scan(code);
            var list = this.findAll();
            list.push(item);
            list = list.slice(list.length - maxHistoryLength);
            var data = JSON.stringify(list);
            $window.localStorage.setItem('scanHistory', data);
            return item;
        };
        this.findAll = function () {
            var output = [];
            var storedData = $window.localStorage.getItem('scanHistory');
            if (storedData !== null) {
                var itemList = JSON.parse(storedData);
                output = itemList.map(function (item) {
                    return Scan(item);
                });
            }
            return output;
        };
        this.findLast = function () {
            var list = this.findAll();
            if (list.length === 0) {
                throw 'No codes read yet!';
            }
            return list[list.length-1];
        };
        this.fetchById = function (id) {
            var result = this.findAll().find(function (item) {
                return (item.id === id);
            });
            if (result === undefined) {
                throw "Unknown scan '"+id+"'!";
            }
            return result;
        };
    })
    .factory('Scan', function (Guid) {
        return function (data) {
            var item = {
                id: undefined,
                code: undefined,
                created_on: new Date()
            }
            if (typeof data === 'string') {
                item.code = data;
            } else {
                if (typeof data.code === 'undefined') {
                    throw 'ScanFactory: A code must be specified';
                }
                item.code = data.code;
                if (typeof data.created_on === 'string') {
                    item.created_on = new Date(data.created_on);
                }
                if (typeof data.id === 'string') {
                    item.id = data.id;
                }
            }
            if (item.id === undefined) {
                item.id = Guid.newGuid();
            }
            return item;
        };
    })
;
