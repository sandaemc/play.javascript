export enum ReportAggregation {
    Summary = 'Summary',
    Hourly = 'Hourly',
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Yearly = 'Yearly',
    HourOfDay = 'HourOfDay',
    DayOfWeek = 'DayOfWeek',
    WeeklyStartingMonday = 'WeeklyStartingMonday',
  }
  
  export enum ReportTimePeriod {
    Today = 'Today',
    Yesterday = 'Yesterday',
    LastSevenDays = 'LastSevenDays',
    ThisWeek = 'ThisWeek',
    LastWeek = 'LastWeek',
    Last14Days = 'Last14Days',
    Last30Days = 'Last30Days',
    LastFourWeeks = 'LastFourWeeks',
    ThisMonth = 'ThisMonth',
    ThisYear = 'ThisYear',
    LastYear = 'LastYear',
    ThisWeekStartingMonday = 'ThisWeekStartingMonday',
    LastWeekStartingMonday = 'LastWeekStartingMonday',
    LastFourWeeksStartingMonday = 'LastFourWeeksStartingMonday',
  }
  
  enum ReportType {
    KeywordPerformanceReport = 'KeywordPerformanceReport',
    CallDetailReport = 'CallDetailReport',
  }
  
  export class ReportRequest {
    private accountId!: string;
    private reportAggregation!: ReportAggregation;
    private dateRange!: [Date, Date];
    private reportTimePeriod!: ReportTimePeriod;
  
    private constructor(private readonly reportType: ReportType, private readonly columns: string[]) { }
  
    static newKeywordPerformanceReport(columns: string[]) {
      return new ReportRequest(ReportType.KeywordPerformanceReport, columns);
    }
  
    static newCallDetailReport() {
      return new ReportRequest(ReportType.CallDetailReport, [
        'AccountId',
        'AccountName',
        'AccountStatus',
        'AdGroupId',
        'AdGroupName',
        'AdGroupStatus',
        'AreaCode',
        'CampaignId',
        'CampaignName',
        'CampaignStatus',
        'City',
        'Duration',
        'StartTime',
        'EndTime',
        'State',
      ]);
    }
  
    setAccountId(value: string) {
      this.accountId = value;
      return this;
    }
  
    setReportAggregation(reportAggregation: ReportAggregation) {
      if (!reportAggregation) {
        throw new Error('NullArgumentError: reportAggregation is required');
      }
  
      this.reportAggregation = reportAggregation;
      return this;
    }
  
    setCustomDateRange(start: Date, end: Date) {
      if (!start || !end) {
        throw new Error('NullArgumentError: start and end are required');
      }
  
      if (start > end) {
        throw new Error('InvalidArgumentError: start date must be before end date');
      }
  
      this.dateRange = [start, end];
      return this;
    }
  
    setReportTimePeriod(reportTimePeriod: ReportTimePeriod) {
      if (!reportTimePeriod) {
        throw new Error('NullArgumentError: period is required');
      }
  
      this.reportTimePeriod = reportTimePeriod;
      return this;
    }
  
    private getScope() {
      return {
        ...(this.accountId ? { AccountIds: { 'q1:long': this.accountId } } : {}),
      };
    }
  
    private getTime() {
      if (this.reportTimePeriod) {
        return {
          PredefinedTime: this.reportTimePeriod.toString(),
        };
      }
  
      if (this.dateRange) {
        const [start, end] = this.dateRange;
  
        return {
          CustomDateRangeEnd: {
            Day: end.getDate(),
            Month: end.getMonth() + 1,
            Year: end.getFullYear(),
          },
          CustomDateRangeStart: {
            Day: start.getDate(),
            Month: start.getMonth() + 1,
            Year: start.getFullYear(),
          },
        };
      }
    }
  
    build() {
      return {
        ReportRequest: {
          attributes: {
            'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
            'i:type': this.reportType.toString() + 'Request',
            'i:nil': false,
          },
          Format: 'Csv',
          ReportName: 'report-request',
          ExcludeColumnHeaders: false,
          ExcludeReportFooter: true,
          ExcludeReportHeader: true,
          ReturnOnlyCompleteData: true,
          Aggregation: this.reportAggregation.toString(),
          Columns: this.columns.map(column => ({ [this.reportType.toString() + 'Column']: column })),
          Filter: { // TODO: can be configurable
            attributes: {
              'i:nil': true,
            },
          },
          Scope: this.getScope(),
          Time: this.getTime(),
        },
      };
    }
  
  
  }
  