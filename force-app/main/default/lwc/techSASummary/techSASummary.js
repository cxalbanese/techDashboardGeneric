import { api, LightningElement, track, wire } from 'lwc';
import { gql, unstable_graphql } from 'lightning/uiGraphQLApi';
import customlabelServiceAppointmentTitle from "@salesforce/label/c.ServiceAppointmentTitle";
import customlabelOpenServiceAppointments from "@salesforce/label/c.OpenServiceAppointments"; 
export default class getSAs extends LightningElement {
    @track saData = [];
    @track errorData;
    labels = {
        customlabelServiceAppointmentTitle,
        customlabelOpenServiceAppointments
    };
    //where clause should be ok      
    @wire(unstable_graphql, {
        query: gql`
        query OpenSAs {
            uiapi{
                query {
                ServiceAppointment (
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
                        SchedStartTime @category(name: "DateTimeValue") {
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
}