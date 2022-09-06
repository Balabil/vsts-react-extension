/// <reference types="vss-web-extension-sdk" />

import React, { useState } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import 'script-loader!vss-web-extension-sdk/lib/VSS.SDK';
import axios from 'axios';

//Returns details of all pull requests across project
export function getPullRequests(callback: any) {
  const url = `https://dev.azure.com/${VSS.getWebContext().collection.name}/${VSS.getWebContext().project.name}/_apis/git/pullrequests?api-version=6.0`;
  //  const url = `https://dev.azure.com/bentleycs/AssetWise/_apis/git/pullrequests?api-version=6.0`
  VSS.require(["VSS/Authentication/Services"],
    function (VSS_Auth_Service: any) {
      VSS.getAccessToken().then(function (token) {
        var authHeader = VSS_Auth_Service.authTokenManager.getAuthorizationHeader(token);
        axios.get(url, {
          headers: {
            withCredentials: true,
            Authorization: authHeader,
            accept: 'application/json;api-version=4.1;excludeUrls=true'
          }
        })
          .then(res => {
            callback(res.data.value);
          });
      });
    });
}

export function getRepos(callback: any) {
  const url = 'https://dev.azure.com/' + VSS.getWebContext().collection.name + '/' + VSS.getWebContext().project.name + '/_apis/git/repositories?api-version=6.0';
  // const url = `https://dev.azure.com/bentleycs/AssetWise/_apis/git/repositories?api-version=6.0`
  VSS.require(["VSS/Authentication/Services"],
    function (VSS_Auth_Service: any) {
      VSS.getAccessToken().then(function (token) {
        var authHeader = VSS_Auth_Service.authTokenManager.getAuthorizationHeader(token);
        axios.get(url, {
          headers: {
            withCredentials: true,
            Authorization: authHeader,
            accept: 'application/json;api-version=4.1;excludeUrls=true'
          }
        })
          .then((res: { data: any; }) => {
            callback(res.data.value)
          });
      });
    });
}



