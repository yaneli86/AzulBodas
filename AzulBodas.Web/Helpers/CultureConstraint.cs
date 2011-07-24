﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace AzulBodas.Web.Helpers
{
    public enum Culture
    {
        es = 1,
        en = 2
    }

    public class CultureConstraint : IRouteConstraint
    {
        private string[] _values;
        public CultureConstraint(params string[] values)
        {
            this._values = values;
        }

        public bool Match(HttpContextBase httpContext, Route route, string parameterName,
                            RouteValueDictionary values, RouteDirection routeDirection)
        {

            // Get the value called "parameterName" from the 
            // RouteValueDictionary called "value"
            string value = values[parameterName].ToString();
            // Return true is the list of allowed values contains 
            // this value.
            return _values.Contains(value);

        }

    }
}