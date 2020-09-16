import { LightningElement, track ,wire } from "lwc";
import getChartDataForPrice from "@salesforce/apex/fetchChartData.getChartDataForPrice";
import getChartDataForUnitsSold from "@salesforce/apex/fetchChartData.getChartDataForUnitsSold";

export default class CarModelsComparisonChart extends LightningElement {
    @track chartConfigurationForPrice;
    @track chartConfigurationForUnitsSold;

    @wire(getChartDataForPrice)
    getEntriesForPrice({ error, data }) {
        if (error) {
            this.error = error;
            console.log("error => " + JSON.stringify(error));
            this.chartConfigurationForPrice = undefined;
        } 
        else if (data) {
            let chartData = [];
            let chartLabels = [];
            data.forEach((model) => {
                chartData.push(model.Price__c);
                chartLabels.push(model.Name);
            });

            this.chartConfigurationForPrice = {
                type: "bar",
                data: {
                labels: chartLabels,
                datasets: [{
                    label: "Car Model",
                    barPercentage: 1,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    backgroundColor: "blue",
                    data: chartData
                }]
            },
            options: {}
        };
        console.log("data => ", data);
        this.error = undefined;
        }
    }

    @wire(getChartDataForUnitsSold)
    getEntriesForUnits({ error, data }) {
        if (error) {
            this.error = error;
            console.log("error => " + JSON.stringify(error));
            this.chartConfigurationForUnitsSold = undefined;
        } 
        else if (data) {
            let chartData = [];
            let chartLabels = [];
            data.forEach((model) => {
                chartData.push(model.Total_Cars_Sold__c);
                chartLabels.push(model.Name);
            });

            this.chartConfigurationForUnitsSold = {
                type: "bar",
                data: {
                labels: chartLabels,
                datasets: [{
                    label: "Car Model",
                    barPercentage: 1,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    backgroundColor: "red",
                    data: chartData
                }]
            },
            options: {}
        };
        console.log("data => ", data);
        this.error = undefined;
        }
    }
}