import { LightningElement, track ,wire } from "lwc";
import getChartData from "@salesforce/apex/fetchChartData.getChartData";

export default class CarModelsComparisonChart extends LightningElement {
    @track chartConfiguration;

    @wire(getChartData, {})
    getEntries({ error, data }) {
        if (error) {
            this.error = error;
            console.log("error => " + JSON.stringify(error));
            this.chartConfiguration = undefined;
        } 
        else if (data) {
            let chartData = [];
            let chartLabels = [];
            data.forEach((opp) => {
                chartData.push(opp.Price__c);
                chartLabels.push(opp.Name);
            });

            this.chartConfiguration = {
                type: "bar",
                data: {
                labels: chartLabels,
                datasets: [{
                    label: "Entry",
                    barPercentage: 1,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    backgroundColor: "green",
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