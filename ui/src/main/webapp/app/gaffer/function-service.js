'use strict'

angular.module('app').factory('functions', ['$http', 'schema', 'settings', function($http, schema, settings) {

    var functions = {}


    functions.getFunctions = function(group, property, onSuccess) {
        var type;
        var schema = schema.getSchema();

        if(schema.entities[group]) {
            type = schema.entities[group].properties[property];
        } else if(schema.edges[group]) {
           type = schema.edges[group].properties[property];
        }

        var className = "";
        if(type) {
          className = schema.types[type].class;
        }

        var queryUrl = settings.getRestUrl() + "/graph/config/filterFunctions/" + className;

        if(!queryUrl.startsWith("http")) {
            queryUrl = "http://" + queryUrl;
        }

        $http.get(queryUrl)
        .success(onSuccess)
        .error(function(err) {
            console.err('ERROR: error loading functions for group: ' + group + ', property: ' + property + '.\n' + err)
        })
    }

    functions.getFunctionParameters = function(functionClassName, onSuccess) {
        var queryUrl = settings.restUrl + "/graph/config/serialisedFields/" + functionClassName;

        if(!queryUrl.startsWith("http")) {
            queryUrl = "http://" + queryUrl;    // TODO create common util service
        }

        $http.get(queryUrl)
        .success(onSuccess)
        .error(function(err) {
            console.err('ERROR: Failed to get serialised fields for ' + functionClassName + '.\n' + err)
        })
    }

    return functions;

}])