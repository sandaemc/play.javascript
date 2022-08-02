enum InstacartServiceOptionTierType {
    PRIORITY = 'priority',
    STANDARD = 'standard',
    NO_RUSH_SCHEDULED = 'noRushScheduled',
    NO_RUSH_DISCOUNTED = 'noRushDiscounted'
}

interface InstacartServiceOptionTierViewSection {
    secondaryLabelString: string;
}

interface InstacartServiceOptionTier {
    serviceOptionId: number | null;
    isAvailable: boolean;
    isPreselected: boolean;
    isExpandable: boolean;
    trackingEventSource: string;
    type: InstacartServiceOptionTierType,
    viewSection: InstacartServiceOptionTierViewSection
}

interface InstacartServiceOptionViewSectionSection {
    content: string;
    __typename: "ViewFormattedStringSection";
}

interface InstacartServiceOptionViewSection {
    windowStringFormatted: {
        sections: InstacartServiceOptionViewSectionSection[]
    }
}

interface InstacartServiceOption {
    id: number;
    viewSection: InstacartServiceOptionViewSection;
}

interface InstacartServiceOptionGroupingViewSectionTrackingProperties {
  start_time_beginning_of_the_day_utc: string;
}

interface InstacartServiceOptionGroupingViewSection {
  trackingProperties: InstacartServiceOptionGroupingViewSectionTrackingProperties;
}

interface InstacartServiceOptionGrouping {
    tierType: InstacartServiceOptionTierType,
    serviceOptionIds: number[],
    defaultSelection: boolean,
    viewSection: InstacartServiceOptionGroupingViewSection;
}

export interface InstacartGetServiceOptions {
  getServiceOptions: {
    serviceOptions: InstacartServiceOption[];
    tiers: InstacartServiceOptionTier[];
    serviceOptionGroupings: InstacartServiceOptionGrouping[];
  }
}