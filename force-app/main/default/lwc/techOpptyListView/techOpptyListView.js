

import { api, LightningElement, track, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'; 
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CLOSED_FIELD from '@salesforce/schema/Opportunity.IsClosed'
import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';

import customlabelOpportunitiesCreated from "@salesforce/label/c.OpportunitiesCreated"; 
import customlabelOpportunityDetailsTitle from "@salesforce/label/c.OpportunityDetailsTitle";
import customlabelOpportunitiesNone from "@salesforce/label/c.OpportunitiesNone";  

export default class TechOpptyListView extends LightningElement {
    @api recordId;
    @track records;
    @track fields;
    @track error;
    locale=LOCALE;
    currency=CURRENCY;
    pageToken = null;
    nextPageToken = null;
    previousPageToken = null;
    tableRows=[];
    @track data = [];
    @track rows = [];
    @track columns=[];  
    columnsName = {};
    columnsIndex = {};
    labels = {
        customlabelOpportunitiesCreated,
        customlabelOpportunityDetailsTitle,
        customlabelOpportunitiesNone
    };
    get hasRecords() {
        return this.records && this.records.length > 0;
    }

    //following wire gets the list of field names from the opportunitiy object and stores them in objectFields
    // we will use this info to get the field labels

    @wire(getObjectInfo,{objectApiName: OPPORTUNITY_OBJECT})
    oppInfo({data,error}) {
        if(data) {
            this.apiName = data.apiName;
            this.objectLabelPlural = data.labelPlural;       
            if (data.fields) {
                this.objectFields = data.fields;
              //  this.recordTypeId = data.defaultRecordTypeId;
              }           
        }
        else if (error) {console.log(error);}
    }

    //following wire gets the list of opportunities created by the tech that are either won or open

    @wire(getListUi,{
        objectApiName : OPPORTUNITY_OBJECT, 
        listViewApiName: 'My_Open_or_Won_Opportunities',        
        pageSize: 10,
        pageToken: '$pageToken',
        sortBy: CLOSED_FIELD})
    callback({data, error}) {

        if (data) {
            this.records = data.records.records; 
            this.fields = data.info.displayColumns;
            debugger;
            this.error = undefined;
            this.nextPageToken = data.records.nextPageToken;
            this.previousPageToken = data.records.previousPageToken;
            this.columns = [];

            //this for loop builds an array of column names and datatypes from the My_Open_or_Won_Opportunties lsit view
            //array called columnsName stores the field name and label
            //array called columns stores the field name, label, datatatype and sortable attributes
  
            for (let i = 0; i < data.info.displayColumns.length; i++) {
              let column = data.info.displayColumns[i];
              let columnName = column.fieldApiName;
              this.columnsName[columnName] = column.label;
              this.columnsIndex[columnName] = i;
              let newColumn = {};
              newColumn.label = column.label;
              newColumn.index = column.index;
              newColumn.fieldName = column.fieldApiName;
              newColumn.sortable = column.sortable;
              newColumn.dataType = this.objectFields[column.fieldApiName].dataType;
              this.columns = [...this.columns, newColumn];
            }

          //this for loop runs through all of the opportunity records
          //for each record, it it loops through each field present on the record to build an array
          //containing the all of the record and column data and associated column/field names
            let records = data.records.records;
            let recordsData = [];

            //create an array of field names for each record and store in recordsData
            for (let i = 0; i < records.length; i++) {
              let fields = records[i].fields;
              let record = {};
              for (let property in fields) {
                if (this.columnsName[property]) {
                  let field = fields[property];
                  record[property] = field.value;
                }
              }
              if (record) {
                record.Id = records[i].id;
                recordsData = [...recordsData, record];
              }
            }

            //run through recordsData and combine it all together
            //create an array called rows which has the field name, value and datatype for every field and record
            this.data = recordsData;
            this.rows = [];
            this.data.forEach(function (item, index) {
              let rowArray = [];
              let self = this;
              this.columns.forEach(function (col) {
                let value = item[col.fieldName];
                let cell = {};
                cell.fieldApiName = col.fieldName;
                cell.value = value;
                cell.editMode = false;
                cell.getCellClass = "";
                //changed all to col.dataType == 
                if (col.dataType=='Date') {
                  cell.isDate = true; 
                }
                  else if (col.dataType=='DateTime') {
                    cell.isDateTime = true;
                }  else if (col.dataType=='Currency') {
                    cell.isCurrency = true;
                }  else {
                  cell.isAllOtherTypes = true;
                }
                rowArray.push(cell);
              });
              let row = {};
              row.Id = item.Id;
              row.cells = rowArray;
              this.rows.push(row);
            }, this);    

        } else if (error) {
            console.error(error);
            this.error = error;
            this.records = undefined; 
            this.fields = undefined;
        }
    }
}