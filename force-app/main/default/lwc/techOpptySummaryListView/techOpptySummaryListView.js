debugger;
import { api, LightningElement, track, wire } from 'lwc';
import { gql, unstable_graphql } from 'lightning/uiGraphQLApi';
import customlabelOpportunitiesOpen from "@salesforce/label/c.OpportunitiesOpen";
import customlabelOpportunitiesWon from "@salesforce/label/c.OpportunitiesWon"; 
import customlabelOpportunityTitle from "@salesforce/label/c.OpportunityTitle"; 
import techId from "@salesforce/user/Id"
export default class getOppties extends LightningElement {
labels = {
    customlabelOpportunitiesOpen,
    customlabelOpportunitiesWon,
    customlabelOpportunityTitle
};

    opptyData;
    @track errorData;
     get variables() {
        return { 
          techUserId: techId 
        };
        }
//add where clause once known        
     @wire(unstable_graphql, {
        query: gql`
        query OpportunityQuery {
            uiapi {
              query {
                Opportunity @category(name: "recordQuery") {
                  edges {
                    node {
                      Id
                      Name @category(name: "StringValue") {
                        value
                      }
                      Amount @category(name: "CurrencyValue") {
                        value
                        displayValue
                      }
                      CreatedById @category(name: "IDValue") {
                        value
                      }
                      IsWon @category(name: "BooleanValue") {
                        value
                      }
                      IsClosed @category(name: "BooleanValue") {
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
    get numOpenOppties() {
        let numOpenOppty=0;
        this.opptyData.forEach(opptyFunction);
        function opptyFunction(value) {
            if(!value.IsClosed.value) {
                numOpenOppty++;
            }       
        }
        return numOpenOppty;
    }   
    get numWonOppties() {
        let numWonOppty=0;
        this.opptyData.forEach(opptyFunction);
        function opptyFunction(value) {
            if(value.IsWon.value) {
                numWonOppty++;
            }       
        }
        return numWonOppty;
    } 
}