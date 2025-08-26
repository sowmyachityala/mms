import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AuthService } from 'app/services/auth.service';
import { LanguageTranslateService } from 'app/services/language-translate.service';
import { MosqueService } from 'app/services/mosque.service';
import { SharedService } from 'app/services/shared.service';
import { ToasterService } from 'app/services/toaster.service';
import Chart from 'chart.js/auto';
import { environment } from 'environments/environment';
import { buffer } from 'rxjs';

export class CustomData {
    switch_no: number;
    ud_id: string;
}

export class Device {
    id: string;
    type: string;
    customData: CustomData;
}

@Component({
    selector: 'app-mosque-dashboard',
    templateUrl: './mosque-dashboard.component.html',
    styleUrl: './mosque-dashboard.component.scss',
})
export class MosqueDashboardComponent {
    imageEndPoints = environment.imageEndPoints;
    user: any;
    direction: string = 'ltr';
    mosqueGuid: string = '';
    mosqueInfo: any;
    latitude: any = null;
    longitude: any = null;
    reDirectionURI: string = environment.redirectPartnerURL;
    partnerCode: string;
    chart: any;
    energyData: any = [];
    switchData: any;
    swictchDevices: any;
    switchArray: any;
    isChecked = false;
    TempSensor: any;
    partnerToken: string =
        localStorage.getItem('partnerToken') === null
            ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJPQXV0aENsaWVudCI6IjY2MDJjNzFmZWE0MzFhZmJmZWRlYmY1MyIsIlVzZXIiOnsiX2lkIjoiNjYwM2IwYzVkMzU1YTdhY2ZmZjk0MmYwIiwiaG9tZXMiOlsiNjYwM2IwZjRiYTU5MTQzNmRlNjQ4MmM2Il0sInBhcnRuZXIiOiI2NjAyYjYwZTAzNDg4ZTQxNTI2NjdkMTUifSwiaWF0IjoxNzEzMTU3MzM4LCJleHAiOjE3MTMyNDM3Mzh9.FpoiXN6HIifevARVEpw0fXIV63tZiwGg1Jb9ZOW0qyA'
            : localStorage.getItem('partnerToken');
    selectedTemp: number;
    temps: number[];
    rating: number = 4.4;
    totalEnergy: number;
    currentMonth = new Date().getMonth() + 1;
    currentYear = new Date().getFullYear();
    shortMonthName = this.getFullMonthName(new Date());
    totalLastMonthEnergy: number;
    consumptionPercent: number;
    consumptionDifference: number;

    constructor(
        private sharedService: SharedService,
        private _authService: AuthService,
        private translateSerive: LanguageTranslateService,
        private translate: TranslateService,
        private mosqueService: MosqueService,
        private activatedRoute: ActivatedRoute,
        private toaster: ToasterService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router
    ) {
        //set default language
        translate.setDefaultLang(
            localStorage.getItem('isalaam-language') === null
                ? 'id-ID'
                : localStorage.getItem('isalaam-language')
        );

        this.partnerCode =
            this.activatedRoute.snapshot.queryParamMap.get('code');

        // Create objects based on the JSON payload
        const customData1: CustomData = {
            switch_no: 1,
            ud_id: '6603b5f7d355a7acfff98b88',
        };
        const customData2: CustomData = {
            switch_no: 2,
            ud_id: '6603b5f7d355a7acfff98b88',
        };
        const customData3: CustomData = {
            switch_no: 3,
            ud_id: '6603b5f7d355a7acfff98b88',
        };
        const customData4: CustomData = {
            switch_no: 4,
            ud_id: '6603b5f7d355a7acfff98b88',
        };

        this.swictchDevices = [
            {
                id: '6603b5f7d355a7acfff98b8c',
                name: 'Pair 2 & 3 Combo',
                type: 'entities.types.SWITCH',
                customData: customData1,
            },
            {
                id: '6603b5f7d355a7acfff98b90',
                name: 'Pair 4',
                type: 'entities.types.SWITCH',
                customData: customData2,
            },
            {
                id: '6603b5f7d355a7acfff98b94',
                name: 'Pair 1',
                type: 'entities.types.SWITCH',
                customData: customData3,
            },
            {
                id: '6603b5f7d355a7acfff98b98',
                name: '6A Power Outlet',
                type: 'entities.types.SWITCH',
                customData: customData4,
            },
        ];

        if (this.partnerCode) {
            this.getPartnerAuthToken(this.partnerCode);
        }
        // Populate temperature values from 20 to 30
        this.temps = Array.from({ length: 11 }, (_, i) => i + 20);
    }
    ngOnInit() {
        this.sharedService.direction.subscribe((res) => {
            if (res) {
                this.direction = res;
            }
        });
        this._authService.check().subscribe((res) => {
            if (res) {
                this.user = AuthUtils._decodeToken(
                    localStorage.getItem('isalaamAccessToken')
                );
                this.user.roleName = JSON.parse(
                    this.user?.roleObject
                )?.[0]?.RoleName;
            }
        });

        if (this.sharedService?.mosqueInfo != '') {
            this.mosqueInfo = JSON.parse(this.sharedService?.mosqueInfo);
            if (this.mosqueInfo != null) {
                this.mosqueGuid = this.mosqueInfo?.mosqueContactGuid;
                // this.latitude = this.mosqueInfo?.mosqueGeopoints[0].latitude;
                // this.longitude = this.mosqueInfo.mosqueGeopoints[0].longitude;
                this.latitude = this.mosqueInfo?.latitude;
                this.longitude = this.mosqueInfo?.longitude;
            }
        }

        //this.createChart();
        //this.getPartnerSignInPage();
        this.isTokenExpired(this.partnerToken);
        //this.refresPartnerToken();
    }

    createChart() {
        const ctx = document.getElementById('energyChart') as HTMLCanvasElement;
        const energyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    '00:00',
                    '01:00',
                    '02:00',
                    '03:00',
                    '04:00',
                    '05:00',
                    '06:00',
                    '07:00',
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                    '17:00',
                    '18:00',
                    '19:00',
                    '20:00',
                    '21:00',
                    '22:00',
                    '23:00',
                ],
                datasets: [
                    {
                        label: 'Energy Consumption (kWh)',
                        data: [
                            15, 12, 14, 10, 8, 9, 18, 20, 22, 24, 23, 21, 20,
                            19, 18, 17, 16, 15, 14, 13, 12, 10, 11, 13,
                        ],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    getPartnerSignInPage() {
        this.mosqueService.getPartnerSignInHTMLResponse().subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    window.location.href = res?.result?.data;
                }
                // else{
                //   this.toaster.triggerToast({
                //     type: 'error',
                //     message: 'Error',
                //     description: "Partner sign-in page not dound",
                // });
                // }
            },
            (err) => {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }

    getPartnerAuthToken(partnerCode) {
        let body = {
            grant_type: 'authorization_code',
            code: partnerCode,
            redirect_uri: this.reDirectionURI,
            client_id: 'e9nZEolQS2qOiuTLEtDX',
            client_secret: 'HugVlOyWbepX0uOZLdKTgtWsPBJGnmbQ4Rr',
        };
        this.mosqueService.getPartnerOAuthToken(body).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    console.log(res?.result?.data);
                }
                // else{
                //   this.toaster.triggerToast({
                //     type: 'error',
                //     message: 'Error',
                //     description: "Partner sign-in page not dound",
                // });
                // }
            },
            (err) => {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }

    async energyDataConsumption(): Promise<void> {
        let body = {
            DeviceIds: ['6603b6d8ba591436de64cc1a'],
            Duration: 'month',
            Month: this.currentMonth,
            Year: this.currentYear,
        };
        console.log('Call for Energy Data');

        await this.mosqueService.getEnergyConsumption(body).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    this.energyData = res?.result?.data;
                    console.log('Got Energy Data');
                    this.createEnergyChart();
                    this.lastMonthEnergyDataConsumption();
                }
            },
            (err) => {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }

    createEnergyChart(): void {
        if (this.chart) {
            this.chart.destroy();
        }
        const data = this.energyData;
        const labels = data.map((_, index) => `${index + 1}`);
        const values = data.map((item) => ({
            x: `${item._id}`,
            y: (item.avg_energy / 3600000).toFixed(3),
        }));
        this.totalEnergy = values
            .reduce((acc, curr) => acc + parseFloat(curr.y), 0)
            .toFixed(3);
        this.chart = new Chart('energyChart', {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `Total Konsumsi Energi per Hari untuk ${this.shortMonthName} 2024 - ${this.totalEnergy} kWh`,
                        data: values,
                        backgroundColor: '#FF8C33',
                        borderColor: '#FFFFFF',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                return `Day ${context[0].label}`;
                            },
                            label: function (context) {
                                return `Power Consumption: ${context.parsed.y} kWh`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            callback: (value, index, values) => labels[index],
                            autoSkip: false,
                            maxRotation: 0,
                            padding: 10,
                        },
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    lastMonthEnergyDataConsumption(): void {
        let body = {
            DeviceIds: ['6603b6d8ba591436de64cc1a'],
            Duration: 'month',
            Month: this.currentMonth - 1,
            Year: this.currentYear,
        };
        this.mosqueService.getEnergyConsumption(body).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    const lastMonthEnergyData = res?.result?.data;
                    const data = lastMonthEnergyData;
                    const labels = data.map((_, index) => `${index + 1}`);
                    const values = data.map((item) => ({
                        x: `${item._id}`,
                        y: (item.avg_energy / 3600000).toFixed(3),
                    }));
                    this.totalLastMonthEnergy = values
                        .reduce((acc, curr) => acc + parseFloat(curr.y), 0)
                        .toFixed(3);
                    this.consumptionPercent = isFinite(
                        ((this.totalEnergy - this.totalLastMonthEnergy) /
                            this.totalLastMonthEnergy) *
                            100
                    )
                        ? parseFloat(
                              (
                                  ((this.totalEnergy -
                                      this.totalLastMonthEnergy) /
                                      this.totalLastMonthEnergy) *
                                  100
                              ).toFixed(2)
                          )
                        : 100;
                    this.consumptionDifference =
                        this.totalEnergy - this.totalLastMonthEnergy;
                    if (this.consumptionPercent < 0) {
                        this.consumptionPercent = Math.abs(
                            this.consumptionPercent
                        );
                    }
                    this._changeDetectorRef.detectChanges();
                }
            },
            (err) => {
                this.toaster.triggerToast({
                    type: 'error',
                    message: 'Error',
                    description: err.error.message,
                });
            }
        );
    }

    async switchQueryData(): Promise<void> {
        let body = {
            devices: this.swictchDevices,
        };
        await this.mosqueService.getSwitchQueryData(body).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    const sData = res?.result?.data;
                    this.switchData = sData?.payload?.devices;
                    this.switchArray = Object.keys(this.switchData).map(
                        (key) => ({ key, value: this.switchData[key] })
                    );
                    this.switchArray.forEach((device) => {
                        let matchedDevice = this.swictchDevices.find(
                            (switchDevice) => switchDevice.id === device.key
                        );
                        if (matchedDevice) {
                            device.name = matchedDevice.name;
                        }
                    });
                    this._changeDetectorRef.detectChanges();
                }
            },
            (err) => {
                // this.toaster.triggerToast({
                //     type: 'error',
                //     message: 'Error',
                //     description: err.error.message,
                // });
            }
        );
    }

    getObjectEntries(obj: any): [string, any][] {
        return Object.entries(obj);
    }

    toggleSwitch(id: string, event: any): void {
        this.switchData[id].on = !this.switchData[id].on;
        const switchDevice = this.swictchDevices.find(
            (device) => device.id === id
        );
        if (switchDevice) {
            const switchNo = switchDevice.customData.switch_no;
            const udId = switchDevice.customData.ud_id;
            const payload: any = {
                switchState: event.checked,
                device: {
                    id: id,
                    customData: { switch_no: switchNo, ud_id: udId },
                },
            };
            this.updateSwitch(payload);
        }
    }

    updateSwitch(payload) {
        this.mosqueService.updateSwitchData(payload).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    //this.toaster.triggerToast({ type: 'success', message: 'Success', description: res?.result?.message });
                }
            },
            (err) => {
                // this.toaster.triggerToast({
                //     type: 'error',
                //     message: 'Error',
                //     description: err.error.message,
                // });
            }
        );
    }

    isTokenExpired(partnerToken) {
        //const pToken = AuthUtils._decodeToken(partnerToken);
        const expiry = JSON.parse(atob(partnerToken.split('.')[1])).exp;
        let isExpire = Math.floor(new Date().getTime() / 1000) >= expiry;
        console.log('Partner Token Expiry Check');
        if (isExpire) {
            console.log('Call for New Partner Token');
            localStorage.removeItem('partnerToken');
            this.refresPartnerToken();
        } else {
            console.log('Old Partner Token');
            // this.energyDataConsumption();
            // this.switchQueryData();
            // this.TemperatureSensorData();
            this.loadData();
        }
    }

    refresPartnerToken() {
        let body = {
            grant_type: 'refresh_token',
            refresh_token:
                '52603cdd63fdd16eed66d56bac98fedb6c0c9b6e9deba7fce1a24b296e5b35eb',
            client_id: 'e9nZEolQS2qOiuTLEtDX',
            client_secret: 'HugVlOyWbepX0uOZLdKTgtWsPBJGnmbQ4Rr',
        };
        this.mosqueService.PartnerRefreshToken(body).subscribe((res: any) => {
            if (res?.result?.success) {
                const partnerToken = res?.result?.data?.access_token;
                localStorage.setItem('partnerToken', partnerToken);
                console.log('Got New Partner Token');
                // this.energyDataConsumption();
                // this.switchQueryData();
                // this.TemperatureSensorData();
                this.loadData();
            }
        });
    }

    async TemperatureSensorData(): Promise<void> {
        let body = {
            DeviceIds: ['6603b862d355a7acfff9b751'],
            DataRequestType: 1,
            SensorType: 1,
            Duration: 'day',
            StartDay: new Date().getDate(),
            Month: this.currentMonth,
            Year: this.currentYear,
        };

        await this.mosqueService.getTemperatureSensorData(body).subscribe(
            (res: any) => {
                if (res?.result?.success) {
                    const temp = res?.result?.data;
                    this.TempSensor = temp[0].last_reported_data;
                    this._changeDetectorRef.detectChanges();
                }
            },
            (err) => {
                // this.toaster.triggerToast({
                //     type: 'error',
                //     message: 'Error',
                //     description: err.error.message,
                // });
            }
        );
    }

    refreshData() {
        this.isTokenExpired(this.partnerToken);
    }

    ngOnDestroy(): void {}

    SetTemperature(): void {
        let body = {
            temperature: this.selectedTemp,
            device: {
                id: '6603bc2eba591436de652bb4',
                customData: {
                    userdevice: '6603b862d355a7acfff9b751',
                    device: '48e72968b913',
                    codeset: '65648560cf433b2909945079',
                },
            },
        };
        this.mosqueService.SetAcTemperature(body).subscribe((res: any) => {
            if (res?.result?.success) {
                this.toaster.triggerToast({
                    type: 'success',
                    message: 'Success',
                    description: res?.result?.message,
                });
            }
        });
    }

    getShortMonthName(date: Date): string {
        const options: Intl.DateTimeFormatOptions = { month: 'short' };
        return date.toLocaleString('id-ID', options);
    }

    getFullMonthName(date) {
        const options = { month: 'long' };
        return date.toLocaleString('id-ID', options);
    }

    async loadData() {
        await this.energyDataConsumption();
        await this.switchQueryData();
        await this.TemperatureSensorData();
    }
}
