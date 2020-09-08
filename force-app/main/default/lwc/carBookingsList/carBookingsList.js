import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { updateRecord, deleteRecord } from 'lightning/uiRecordApi';
import getCarBookings from '@salesforce/apex/fetchData.getCarBookings';
import makePostCallout from '@salesforce/apex/carCallout.makePostCallout';

import BOOKINGID from '@salesforce/schema/Car_Booking__c.Id';
import BOOKINGSTAGE from '@salesforce/schema/Car_Booking__c.Booking_Stage__c';
import CARCOLOR from '@salesforce/schema/Car_Booking__c.Car_Color__c';
import CUSTOMERACCOUNT from '@salesforce/schema/Car_Booking__c.Account__c';
import CUSTOMEREMAIL from '@salesforce/schema/Car_Booking__c.Customer_Email__c';
import SPEAKERS from '@salesforce/schema/Car_Booking__c.Speakers__c';
import DIESEL from '@salesforce/schema/Car_Booking__c.Diesel__c';
import AIRBAGS from '@salesforce/schema/Car_Booking__c.Extra_Airbags__c';
import TOTALPRICE from '@salesforce/schema/Car_Booking__c.Total_Price__c';
import CARMODEL from '@salesforce/schema/Car_Booking__c.Car_Model__c'

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
    
    handleNavigate = (event) => {
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