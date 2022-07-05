

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

    @wire(getObjectInfo,{objectApiName: OPPORTUNITY_OBJECT})
    oppInfo({data,error}) {
        if(data) {
            this.apiName = data.apiName;
            this.objectLabelPlural = data.labelPlural;       
            if (data.fields) {
                this.objectFields = data.fields;
                this.recordTypeId = data.defaultRecordTypeId;
              }           
        }
        else if (error) {console.log(error);}
    }

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
            this.error = undefined;
            this.nextPageToken = data.records.nextPageToken;
            this.previousPageToken = data.records.previousPageToken;
            this.columns = [];
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
          //get the records
          
            let records = data.records.records;
            let recordsData = [];
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
            this.data = recordsData;
            this.rows = [];
            this.data.forEach(function (item, index) {
              var rowArray = [];
              var self = this;
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