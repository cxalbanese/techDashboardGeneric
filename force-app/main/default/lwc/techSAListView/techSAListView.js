debugger;
import { api, LightningElement, track, wire } from 'lwc';
import { gql, unstable_graphql } from 'lightning/uiGraphQLApi';
import customlabelServiceAppointmentTitle from "@salesforce/label/c.ServiceAppointmentTitle";
import customlabelServiceAppointmentsNone from "@salesforce/label/c.ServiceAppointmentsNone";
import customlabelSADetailsTitle from "@salesforce/label/c.SADetailsTitle";
import SERVICEAPPOINTMENT_OBJECT from '@salesforce/schema/ServiceAppointment';
import WORKORDER_OBJECT from '@salesforce/schema/WorkOrder';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class techSAListView extends LightningElement {
    workordernumberlabel;
    subjectlabel;
    statuslabel;
    appointmentnumberlabel;
    schedstarttimelabel;
    schedendtimelabel;
    labels = {
        customlabelServiceAppointmentTitle,
        customlabelSADetailsTitle,
        customlabelServiceAppointmentsNone
    };
    @track saData = [];
    @track errorData;    
    @track saData = [];
    @track labelData;
    @track errorData;
   @wire(getObjectInfo, { objectApiName: SERVICEAPPOINTMENT_OBJECT })
    saInfo({ data, error }) {

        if (data) {
            this.subjectlabel=data.fields.Subject.label;
            this.statuslabel=data.fields.Status.label;
            this.appointmentnumberlabel=data.fields.AppointmentNumber.label;
            this.schedstarttimelabel=data.fields.SchedStartTime.label;
            this.schedendtimelabel=data.fields.SchedEndTime.label;
        }
    } 

    @wire(unstable_graphql, {
        query: gql`
        query SALabels {
            uiapi {
                objectInfos(apiNames: ["ServiceAppointment"])  @category(name: "recordQuery")  {
                    fields {
                      ApiName @category(name: "StringValue")
                      label @category(name: "StringValue")
                    }
                }
            }
        }
    `,
    variables: '$variables',
})
    functionLabels ({ data, errors }) {
        if (data) {
            this.labelData =data.uiapi.objectInfos[0].fields; 
            console.log('this label size = ' + this.labelData.length);
            console.log('heres the first fields label ' + this.labelData[0].label );
          }
        if(errors) {
            this.errorData = errors;
        }
    }    
    @wire(unstable_graphql, {
        query: gql`
        query OpenSAs {
            uiapi{
                query {
                ServiceAppointment  (
                    scope: ASSIGNEDTOME,
                    where: {StatusCategory: {in: ["Scheduled","Dispatched"]}},
                    orderBy: {
                        AppointmentNumber:{
                            order:ASC,
                            nulls:FIRST
                        }
                    }
                ) @category(name: "recordQuery") {
                    edges {
                        node {
                            Id
                        AppointmentNumber @category(name: "StringValue") {
                            value
                        }
                        Subject @category(name: "StringValue") {
                            value
                        }
                        Status @category(name: "PicklistValue") {
                            value
                            displayValue
                        }
                        ParentRecordId @category(name: "StringValue") {
                            value
                        }
                        SchedStartTime @category(name: "DateTimeValue"){
                            value
                        }
                        SchedEndTime @category(name: "DateTimeValue") {
                            value
                        }
                        DurationInMinutes @category(name: "IntValue") {
                            value
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
    function ({ data, errors }) {
        if (data) {
            this.saData =data.uiapi.query.ServiceAppointment.edges.map(edge => edge.node); 
            console.log('this saSize size = ' + this.saData.length);
          }
        if(errors) {
            this.errorData = errors;
        }
    }
    get numOpenSAs() {
        return this.saData.length;
    }   
     
    get hasRecords() {
        return this.saData && this.saData.length > 0;
    }

    get debuggerInfo() {
        if(this.labelData && this.labelData.length>0) {
        console.log('inside of getter '+ this.labelData[0].label);
        return this.labelData[0].label;}
        return 'no data yet'
    }

}