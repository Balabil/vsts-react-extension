/// <reference types="vss-web-extension-sdk" />

import React, { useState, useEffect } from 'react';
import { Table } from '@itwin/itwinui-react';
import dayjs, { Dayjs } from 'dayjs';
import './App.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import 'script-loader!vss-web-extension-sdk/lib/VSS.SDK';
import { getPullRequests, getRepos } from './Components/Pull-requests';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function RepoTable(props: any): any {
  return (
    <>
      <Table
        columns={[
          {
            Header: 'Table',
            columns: [
              {
                Filter: function noRefCheck(): any { },
                Header: 'Repositories',
                accessor: 'name',
                id: 'name'

              },
              {
                Header: "Number Of PR's",
                accessor: 'description',
                id: 'description'
              }
            ]
          }
        ]}
        data={props.repo}
        density="default"
        emptyFilteredTableContent="No results found. Clear or try another filter."
        emptyTableContent="No data."
        isSelectable
        isSortable
        style={{ maxHeight: '100vh' }}
        onExpand={function noRefCheck() { }}
      />
    </>
  )
}

function App() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [PullRequests, setPullRequests] = useState<any>([]);
  const [Repos, setRepos] = useState<any>([]);
  const [Builds, setBuilds] = useState<any>([]);
  var RepoArray: any = [];
  var tempArray: any = [];

  useEffect(() => {
    getPullRequests((resp: any) => {
      setPullRequests(resp);
    });
    getRepos((resp: any) => {
      setRepos(resp)
    })
  }, []);

  useEffect(() => {
    console.log('Date: ')
    console.log((value?.month() ? value?.month()+1 : 0))
    console.log((value?.year()))
  }, [value]);
    

  if (Repos != undefined) {
    Repos.map((repo: any) => {
      PullRequests.map((pr: any) => {
        var date = pr.creationDate.split("-");
        if (pr.repository.id == repo.id && date[0] == value?.year() && (date[1]-1) == value?.month()) {
          tempArray.push({
            description: pr.description, name:
              <div>
                <a href={'https://dev.azure.com/bentleycs/AssetWise/AssetWise/_git/'+ repo.name  + '/pullrequest/' + pr.pullRequestId}>{pr.title}</a>
                <div style={{ color: 'blue', fontSize: '12px' }}>{pr.createdBy.displayName} requested #{pr.pullRequestId} on {pr.creationDate}</div>
              </div>
          })
        }
      })
      RepoArray.push({ description: '' + tempArray.length, name: repo.name, subRows: tempArray })
      tempArray = [];
    })
  }

  console.log('Repos: ')
  console.log(Repos)

  console.log('PRs: ')
  console.log(PullRequests[0])




  return (
    <div >
      <br></br>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month']}
          label="Year and Month"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <br></br>
      <br></br>
      
      <RepoTable repo={RepoArray} />
    </div>
  );
}

export default App;
function data(data: any, arg1: void) {
  throw new Error('Function not implemented.');
}

