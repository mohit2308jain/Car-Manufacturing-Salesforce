import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCarBookings from '@salesforce/apex/fetchData.getCarBookings';
import makePostCallout from '@salesforce/apex/carCallout.makePostCallout';

export default class CarBookingsList extends LightningElement {

    @track viewModelId;
    @track showViewModal = false;
    @track viewRecId;
    @track carBookings;
    @track error;
    @track carBooking;
    @track datas;
    @track len = false;
    
    constructor(){
        super();
        getCarBookings()
        .then((result) => {
            this.carBookings = result;
            this.datas = result;
            console.log(result);
            this.setLen(result.length);
        }) 
        .catch((error) => {
            this.error = error;
            this.showErrorToast(error);
        })
    }

    setLen = (res) => {
        this.len = (res) ? true : false;
    }

    showErrorToast = (err) => {
        const event = new ShowToastEvent({
            title: 'Error',
            variant: 'error',
            message: err.body.message,
        });
        this.dispatchEvent(event);
    }

    //Function used to fetch records according to the value given as input in the searchbar
    searchRecords = (event) => { 
        const searchTerm = event.target.value;
        
        if(searchTerm){
            this.carBookings = this.carBookings.filter((booking) => {
                return booking.Account__r.Name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            this.setLen(this.carBookings.length);
        }
        else if(!searchTerm){
            this.carBookings = this.datas;
            this.setLen(this.carBookings.length);
        }
    }
    
    handleCallout = (event) => {
        console.log(event.target.name);
        makePostCallout({recordId: event.target.name})
            .then((res) => {
                console.log(res);
                const event = new ShowToastEvent({
                    title: 'Success',
                    variant: 'Success',
                    message: 'Data Sent',
                });
                this.dispatchEvent(event);
            })
            .catch((err) => {
                console.log(err);
                this.showErrorToast(err);
            })
    }

    openViewModal = (event) => {
        this.viewRecId = event.target.name;
        this.carBooking = this.datas.filter((model) => {
            return model.Id.includes(this.viewRecId);
        })[0];

        this.showViewModal = true;
    }

    closeViewModal = (event) => {
        this.viewModelId = '';
        this.showViewModal = false;
    }
}