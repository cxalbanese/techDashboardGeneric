import { api, LightningElement, track, wire } from 'lwc';
import { gql, unstable_graphql } from 'lightning/uiGraphQLApi';
// import getTS from '@salesforce/apex/techDashboard.getTSHeader';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
//import techId from '@salesforce/user/Id';
import customlabelTimeSheetEntriesNone from "@salesforce/label/c.TimeSheetEntriesNone";
import customlabelTimeSheetEntryDetailsTitle from "@salesforce/label/c.TimeSheetEntryDetailsTitle";
import customlabelBackTitle from "@salesforce/label/c.Back";
import TIMESHEET_OBJECT from '@salesforce/schema/TimeSheet';
import TIMESHEETENTRY_OBJECT from '@salesforce/schema/TimeSheetEntry';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import TIMESHEETNUMBER_FIELD from '@salesforce/schema/TimeSheet.TimeSheetNumber';
import STARTDATE_FIELD from '@salesforce/schema/TimeSheet.StartDate';
import ENDDATE_FIELD from '@salesforce/schema/TimeSheet.EndDate';

export default class techTimeSheetListView extends LightningElement {
    timesheetnumberlabel;
    timesheetentrynumberlabel;
    typelabel;
    starttimelabel;
    endtimelabel;
    timesheetnumber;
    timesheetstartdate;
    timesheetenddate;
    labels = {
        customlabelTimeSheetEntryDetailsTitle,
        customlabelTimeSheetEntriesNone,
        customlabelBackTitle
    };
    @track tseData = [];
    @track errorData;
    get variables() {
        return { 
                 tsId : "1tsRO0000000cWyYAI",
                 techSRId: "0HnRO0000000NYn0AM"};
     }

    @wire(getRecord, { recordId: '$tsRecordId', fields: [TIMESHEETNUMBER_FIELD, STARTDATE_FIELD,ENDDATE_FIELD] })
    tsData;

    @wire(getObjectInfo, { objectApiName: TIMESHEET_OBJECT })
    tsInfo({ data, error }) {
        if (data) {
            this.timesheetnumberlabel=data.fields.TimeSheetNumber.label;
        }
    }
   @wire(getObjectInfo, { objectApiName: TIMESHEETENTRY_OBJECT })
    tseInfo({ data, error }) {
        if (data) {
            this.timesheetentrynumberlabel=data.fields.TimeSheetEntryNumber.label;
            this.typelabel=data.fields.Type.label;
            this.starttimelabel=data.fields.StartTime.label;
            this.endtimelabel=data.fields.EndTime.label;
        }
    } 
    @wire(unstable_graphql, {
        query: gql`
        query TS ($techSRId: ID) {
            uiapi {
              query {
                TimeSheet (where:{ and : [{ServiceResourceId:{eq: $techSRId}
                  StartDate: {eq: { literal:THIS_WEEK}}}]},first:1 ) @category(name: "recordQuery") {
                  edges {
                    node {
                      Id
                      TimeSheetNumber @category(name: "StringValue") {
                        value
                      }
                      StartDate @category(name: "DateValue") {
                        value
                      }
                      EndDate @category(name: "DateValue") {
                        value
                      }
                      TimeSheetEntries @category(name: "childRelationship") {
                        edges {
                          node {
                            Id
                            TimeSheetEntryNumber @category(name: "StringValue")  {
                              value
                            }
                            Type @category(name: "PicklistValue") {
                              value
                            }
                            StartTime @category(name: "DateTimeValue") {
                              value
                            }
                            EndTime @category(name: "DateTimeValue") {
                              value
                            }
                            DurationInMinutes @category(name: "DateValue") {
                              value
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
    variables: '$variables',
  })
    functionTSEs ({ data, errors }) {
        if (data) {
            this.tseData=data.uiapi.query.TimeSheet.edges.map(edge => edge.node)[0]; 
            this.timesheetnumber = this.tseData.TimeSheetNumber.value;
            this.timesheetstartdate = this.tseData.StartDate.value;
            this.timesheetenddate = this.tseData.EndDate.value;
            this.tseData = this.tseData.TimeSheetEntries.edges.map(edge => edge.node);
        }       
        if (errors) {
            this.error = errors;
        }
    } 
    
     get hasRecords() {
        return this.tseData && this.tseData.length > 0;
     }
     get tsNumber() {
        return this.timesheetnumber;
    }
    get tsStartDate() {
        return this.timesheetstartdate;
    }
    get tsEndDate() {
        return this.timesheetenddate;
    }
}