debugger;
import { api, LightningElement, track, wire } from 'lwc';
import { gql, unstable_graphql } from 'lightning/uiGraphQLApi';
import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';

import customlabelOpportunitiesCreated from "@salesforce/label/c.OpportunitiesCreated"; 
import customlabelOpportunityDetailsTitle from "@salesforce/label/c.OpportunityDetailsTitle";
import customlabelOpportunitiesNone from "@salesforce/label/c.OpportunitiesNone";  

export default class TechOpptyListView extends LightningElement {

    @track error;
    locale=LOCALE;
    currency=CURRENCY;
    opptyData;
    errorData;
    labels = {
        customlabelOpportunitiesCreated,
        customlabelOpportunityDetailsTitle,
        customlabelOpportunitiesNone
    };
    get hasRecords() {
        return this.records && this.records.length > 0;
    }
    //define variables when known
    get variables () {
      return {
        variable1 : "tbd"
      }
    }
    //add where clause once known        
    @wire(unstable_graphql, {
      query: gql`
      query OpportunityQuery  {
          uiapi {
            query {
              Opportunity @category(name: "recordQuery") {
                edges {
                  node {
                    Id
                    Name @category(name: "StringValue") {
                      value
                    }
                    StageName @category(name: "PicklistValue") {
                      value
                      displayValue
                    }
                    Amount @category(name: "CurrencyValue") {
                      value
                      displayValue
                    }
                    CloseDate @category(name: "DateValue") {
                      value
                    }
                    CreatedById @category(name: "IDValue") {
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
      this.opptyData =data.uiapi.query.Opportunity.edges.map(edge => edge.node); 
      console.log('this opptyData size = ' + this.opptyData.length);
    }
  if(errors) {
      this.errorData = errors;
  }
}
}