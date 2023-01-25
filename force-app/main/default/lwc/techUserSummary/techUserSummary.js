import { api, LightningElement, track, wire } from 'lwc';
import { gql, unstable_graphql } from 'lightning/uiGraphQLApi';
import techId from '@salesforce/user/Id';
import customlabelUserTitle from "@salesforce/label/c.UserTitle";
import customlabelUserName from "@salesforce/label/c.UserName";
import customlabelUserLastLocationDate from "@salesforce/label/c.UserLastLocationDate";

export default class getSRInfo extends LightningElement {
    @track srData;
    @track errorData; 
    labels = {
        customlabelUserTitle,
        customlabelUserName,
        customlabelUserLastLocationDate
    };
    get variables() {
      return { techUserId : techId, /* this is the user id of the running user */
                techSRId: '0HnRO0000000NYn0AM'}; /* this is the service resource id for my user - hardcoded */
      }
    //the wire works if I query on the hard coded $techSRId. 
    //If I use - query technician ($techUserId: ID)....(where: { RelatedRecordId: { eq: $techUserId }} )
    //it works on the laptop but not in SFS Mobile
    @wire(unstable_graphql, {
        query: gql`
        query technician ($techSRId: ID) {
            uiapi {
                query {
                    ServiceResource (where: { Id: { eq: $techSRId }} ) @category(name: "recordQuery") {
                        edges {
                            node {
                                Id
                                Name @category(name: "StringValue") {
                                    value
                                }
                                LastKnownLocationDate @category(name: "DateTimeValue") {
                                    value
                                    displayValue
                                }
                                RelatedRecordId @category(name: "IDValue") {
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
            this.srData =data.uiapi.query.ServiceResource.edges[0].node; 
          }
        if(errors) {
            this.errorData = errors;
        }
    }  
    get techName() {
        return this.srData ? this.srData.Name.value : '';
    }   
    get techLastDate() {
        return this.srData ? this.srData.LastKnownLocationDate.value : '';
    }   
}