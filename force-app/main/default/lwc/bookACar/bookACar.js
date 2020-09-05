import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord, deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getCarModels from '@salesforce/apex/fetchData.getCarModels';

export default class BookACar extends NavigationMixin(LightningElement) {

    @wire(getCarModels) carModels;
    @track viewModelId;
    
    handleNavigate = (event) => {
        let recid = event.target.name;
        console.log(recid);

        var compDefinition = {
            componentDef: "c:carBookingPage",
            attributes: {
                recId: recid
            }
        };
        // Base64 encode the compDefinition JS object
        var encodedCompDef = btoa(JSON.stringify(compDefinition));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedCompDef
            }
        });
    }

    openViewModal = (event) => {
        console.log(event.target.name); 
    }
}

        /*
        this[NavigationMixin.Navigate]({
            type: "standard__component",
            attributes: {
                componentName: "c__NavigateToLWC"
            },
            state: {
                c__propertyValue: recid
            }
        });
        */

        /*
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Car_Booking__c',
                actionName: 'new'
            },
        });
        */