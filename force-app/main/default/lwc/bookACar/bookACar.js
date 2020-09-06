import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getLaunchedCarModels from '@salesforce/apex/fetchData.getLaunchedCarModels';
import getLaunchedCarModelBySearchTerm from '@salesforce/apex/fetchData.getLaunchedCarModelBySearchTerm';

export default class BookACar extends NavigationMixin(LightningElement) {

    @track viewModelId;
    @track showViewModal = false;
    @track viewRecId;
    @track carModels;
    @track error;
    
    @wire(getLaunchedCarModels)
    Car_Model__c({data, error}){
        if(data){
            this.handleDataToShow(data);
            this.error = undefined;
        }
        else if(error){
            this.carModels = undefined;
            this.error = error;
        }
    }

    handleDataToShow = (result) => {
        console.log("data");
        console.log(result);
        this.carModels = result;
    }

    //Function used to fetch records according to the value given as input in the searchbar
    searchRecords = (event) => { 
        
        const searchTerm = event.target.value; 
        console.log(searchTerm);
        if(searchTerm){
            getLaunchedCarModelBySearchTerm( { searchTerm } ).then((result) => {
                this.handleDataToShow(result);
            }) 
            .catch(error => { 
                this.error = error; 
            }); 
        } 
        else if(!searchTerm) 
        {
            getLaunchedCarModels()
            .then(result => {
                this.handleDataToShow(result);
            }) 
            .catch(error => {
                this.error = error;
            })
        }
        else{
            this.carModels = undefined; 
        }
    }
    
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
        this.viewRecId = event.target.name;
        this.showViewModal = true;
    }

    closeViewModal = (event) => {
        this.viewModelId = '';
        this.showViewModal = false;
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

        <header class="slds-modal__header">
                    <button class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse" title="Close" onclick={closeModal}>
                    <lightning-icon icon-name="utility:close"
                        alternative-text="close"
                        variant="inverse"
                        size="small" ></lightning-icon>
                    <span class="slds-assistive-text">Close</span>
                    </button>
                    <h2 id="modal-heading-01" class="slds-text-heading_medium slds-hyphenate">Request Detail</h2>
                </header>


        */