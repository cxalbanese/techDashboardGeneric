debugger
import { api, LightningElement,track,wire} from 'lwc';
import { gql, unstable_graphql } from 'lightning/uiGraphQLApi';
// import techId from '@salesforce/user/Id';
import customlabelTitle from "@salesforce/label/c.TimeSheetSummaryTitle";
import customlabelSubtitle from "@salesforce/label/c.TimeSheetSummarySubtitle";
import customlabelTotal from "@salesforce/label/c.Total";
import customlabelStraight from "@salesforce/label/c.Straight";
import customlabelBurden from "@salesforce/label/c.Burden";
import customlabelOvertime from "@salesforce/label/c.Overtime";
import customlabelMonday from "@salesforce/label/c.Monday";
import customlabelTuesday from "@salesforce/label/c.Tuesday";
import customlabelWednesday from "@salesforce/label/c.Wednesday";
import customlabelThursday from "@salesforce/label/c.Thursday";
import customlabelFriday from "@salesforce/label/c.Friday";
import customlabelSaturday from "@salesforce/label/c.Saturday";
import customlabelSunday from "@salesforce/label/c.Sunday";

export default class techTimeSheetHeader extends LightningElement {
    @track tsRecordId='elmpo';
    @track records;
    @track dowHours = [];
    @track burden=0;
    @track straight=0;
    @track overtime=0;
    @track total=0;
    @track rows=[];
    labels = {
        customlabelTitle,
        customlabelSubtitle,
        customlabelTotal,
        customlabelBurden,
        customlabelStraight,
        customlabelOvertime
    };
    labelArray=[customlabelMonday,customlabelTuesday,customlabelWednesday,customlabelThursday,customlabelFriday,customlabelSaturday,customlabelSunday];
    get variables() {
        return { 
                 tsId : "1tsRO0000000cWyYAI",
                 techSRId: "0HnRO0000000NYn0AM"};
     }
    get tsNumber() {
        return this.tseData.TimeSheetNumber.value;
    }
    get tsStartDate() {
        return this.tseData.StartDate.value;
    }
    get tsEndDate() {
        return this.tseData.EndDate.value;
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
            //create totals for each day of week
            //create totals for overtime, burden and straight based on timesheetentry.type field
            this.records = this.tseData.TimeSheetEntries.edges.map(edge=>edge.node);
            this.error = undefined;
            this.dowHours = this.initializeHours();
            for(const record in this.records) {
                const val=this.records[record];
               let mydate = new Date(val.StartTime.value);
               if(mydate) {
                    let hours = val.DurationInMinutes.value / 60;
                    let dow = mydate.getDay();
                    //Monday is the first day, shift everything by 1 and move Sunday to 6
                    if(dow == 0)
                        dow = 6;
                    else 
                        dow--;
                    this.dowHours[dow] += hours;
                    if(val.Type.value=='Indirect') {
                        this.burden+= hours;
                    }
                    else if (val.Type.value == 'Overtime') {
                        this.overtime+= hours;
                    }
                    else {
                        this.straight+= hours;
                    }
                    this.total+= hours;
               } 
            }
            this.rows = this.buildRows(this.dowHours); 
        } else if (errors) {
            //if there is an error, we'll just return zeroes for all days of week
            this.error = errors;
            this.records = undefined;
            this.dowHours = this.initializeHours();
            this.rows = this.buildRows(this.dowHours);  
        }
    } 
    get tseDataSize() {
        return this.records;
    }
    initializeHours() {
        let initHours=[];
        for(let x=0;x<7;x++)
            initHours[x]=0; 
        return initHours;
    }
    buildRows(brDowHours) {
        let brRows=[];
        let x = 0;
        for (const element of brDowHours) {
            let row={};
            row.id = x;
            row.value = element;
            row.label = this.labelArray[x];
            x++;
            brRows.push(row);
          }
        return brRows;
    }
}


  